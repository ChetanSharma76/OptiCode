import { exec, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const SANDBOX_DIR = '/sandbox';
const MAX_OUTPUT_SIZE = parseInt(process.env.MAX_OUTPUT_SIZE || '1024') * 1024; // bytes
const TIME_LIMIT_MS = parseInt(process.env.MAX_EXECUTION_TIME || '5000'); // ms

const getFileExtension = (language) => {
  switch (language) {
    case 'python': return 'py';
    case 'cpp': return 'cpp';
    case 'java': return 'java';
    default: return 'txt';
  }
};

const sanitizeError = (error, fileIdentifiers = []) => {
  if (!error) return '';
  let sanitized = error;
  for (const identifier of fileIdentifiers) {
    const escaped = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(escaped, 'g');
    sanitized = sanitized.replace(regex, '');
  }
  return sanitized;
};


const writeFile = (filePath, content) => {
  console.log(`[WRITE] Writing file to ${filePath}`);
  fs.writeFileSync(filePath, content, { mode: 0o400 });
};

const cleanupFiles = (files) => {
  console.log(`[CLEANUP] Cleaning up files:`, files);
  for (const file of files) {
    try {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        console.log(`[CLEANUP] Deleted ${file}`);
      }
    } catch (err) {
      console.error(`[CLEANUP ERROR] Failed to delete ${file}:`, err);
    }
  }
};

export const executeCode = async (code, language, input = '') => {
  const executionId = uuidv4();
  const filename = `${executionId}.${getFileExtension(language)}`;
  const execName = `${executionId}.out`;

  const filePath = path.join(SANDBOX_DIR, filename);
  const execPath = path.join(SANDBOX_DIR, execName);

  try {
    let runCmd = '';
    let cleanupList = [];

    if (language === 'java') {
      const match = code.match(/public\s+class\s+(\w+)/);
      const javaClassName = match ? match[1] : 'Main';
      const javaFileName = `${javaClassName}.java`;
      const javaFilePath = path.join(SANDBOX_DIR, javaFileName);

      fs.writeFileSync(javaFilePath, code, { mode: 0o400 });

      const compileJavaCmd = `javac ${javaFilePath}`;
      runCmd = `java -cp ${SANDBOX_DIR} ${javaClassName}`;

      const compileResultJava = await new Promise((resolve) => {
        exec(compileJavaCmd, { timeout: TIME_LIMIT_MS }, (error, stdout, stderr) => {
          if (error) {
            resolve({ success: false, error: stderr || stdout || error.message });
          } else {
            resolve({ success: true });
          }
        });
      });

      if (!compileResultJava.success) {
        const sanitizedError = sanitizeError(compileResultJava.error, [javaFilePath]);
        cleanupFiles([javaFilePath, path.join(SANDBOX_DIR, `${javaClassName}.class`)]);
        return {
          success: false,
          verdict: 'Compilation Error',
          type: 'Compilation Error',
          error: sanitizedError,
          output: '',
          memoryUsed: 0,
        };
      }



      cleanupList = [javaFilePath, path.join(SANDBOX_DIR, `${javaClassName}.class`)];
    } else {
      writeFile(filePath, code);

      if (language === 'cpp') {
        const compileCmd = `g++ ${filePath} -o ${execPath} -O2 -static-libstdc++`;
        const compileResult = await new Promise((resolve) => {
          exec(compileCmd, { timeout: TIME_LIMIT_MS }, (error, stdout, stderr) => {
            if (error) {
              resolve({ success: false, error: stderr || stdout || error.message });
            } else {
              resolve({ success: true });
            }
          });
        });

        if (!compileResult.success) {
          console.error('[COMPILE ERROR]', compileResult.error); 
          cleanupFiles([filePath, execPath]);
          return {
            success: false,
            verdict: 'Compilation Error',
            type: 'Compilation Error',
            error: compileResult.error,
            output: '',
            memoryUsed: 0,
          };
        }

        runCmd = execPath;
        cleanupList = [filePath, execPath];
      } else if (language === 'python') {
        runCmd = `python3 ${filePath}`;
        cleanupList = [filePath];
      } else {
        cleanupFiles([filePath, execPath]);
        return {
          success: false,
          verdict: 'Bad Request',
          type: 'Bad Request',
          error: `Unsupported language: ${language}`,
          output: '',
          memoryUsed: 0,
        };
      }
    }

    const [cmd, ...args] = runCmd.split(' ');
    console.log(`[EXEC] Running command: ${cmd} ${args.join(' ')}`);

    return await new Promise((resolve) => {
      const proc = spawn(cmd, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { PATH: '/usr/bin:/bin:/usr/local/bin' },
        timeout: TIME_LIMIT_MS,
      });

      let output = '';
      let error = '';

      if (input && ['python', 'cpp', 'java'].includes(language)) {
        proc.stdin.write(input);
      }
      proc.stdin.end();

      proc.stdout.on('data', (data) => {
        output += data.toString();
        if (output.length > MAX_OUTPUT_SIZE) {
          proc.kill('SIGKILL');
        }
      });

      proc.stderr.on('data', (data) => {
        error += data.toString();
      });

      proc.on('close', (code, signal) => {
        cleanupFiles(cleanupList);

        if (signal === 'SIGKILL') {
          resolve({
            success: false,
            verdict: 'Time Limit Exceeded',
            type: 'Time Limit Exceeded',
            error: 'Process killed due to timeout or resource limits',
            output: '',
            memoryUsed: 0,
          });
        } else if (code === 0) {
          resolve({
            success: true,
            verdict: 'Executed',
            output: output.slice(0, MAX_OUTPUT_SIZE),
            memoryUsed: 0,
          });
        } else {
            const identifiersToStrip = [];

            if (language === 'python') identifiersToStrip.push(filePath);
            else if (language === 'java') {
              const match = code.match(/public\s+class\s+(\w+)/);
              const className = match ? match[1] : 'Main';
              identifiersToStrip.push(`${className}.java`);
            }

            resolve({
              success: false,
              verdict: 'Runtime Error',
              type: 'Runtime Error',
              error: sanitizeError(error || 'Runtime error or non-zero exit code', identifiersToStrip),
              output: output.slice(0, MAX_OUTPUT_SIZE),
              memoryUsed: 0,
            });

          }
      });

      setTimeout(() => {
        proc.kill('SIGKILL');
      }, TIME_LIMIT_MS + 1000);
    });
  } catch (err) {
    cleanupFiles([
      filePath,
      execPath,
      path.join(SANDBOX_DIR, 'Main.java'),
      path.join(SANDBOX_DIR, 'Main.class'),
    ]);
    return {
      success: false,
      verdict: 'Internal Error',
      type: 'Internal Error',
      error: `An internal error occurred: ${err.message || err}`,
      output: '',
      memoryUsed: 0,
    };
  }
};
