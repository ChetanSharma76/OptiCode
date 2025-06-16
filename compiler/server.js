import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { executeCode } from './service/codeExecutor.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 4000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

app.use(cors());
app.use(bodyParser.json());
app.use(limiter);

app.post('/', async (req, res) => {
  const { code, language, input } = req.body;

  if (!code || !language) {
    return res.status(400).json({
      success: false,
      verdict: 'Bad Request',
      type: 'Bad Request',
      error: 'Code and language are required',
      executionTime: 0,
      memoryUsed: 0,
    });
  }

  try {
    const start = process.hrtime.bigint();
    const result = await executeCode(code, language, input || '');
    const end = process.hrtime.bigint();
    const executionTime = Number(end - start) / 1e6; // Convert to milliseconds
    if (result.success) {
      return res.status(200).json({
        success: true,
        verdict: 'Executed',
        output: result.output,
        executionTime,
        memoryUsed: result.memoryUsed || 0,
      });
    } else {
      return res.status(200).json({
        success: false,
        verdict: result.type,
        type: result.type,
        error: result.error.replace(/\/sandbox\/[a-zA-Z0-9\-]+\.cpp:/g, 'Line:') || 'Unknown error',
        executionTime,
        memoryUsed: result.memoryUsed || 0,
      });
    }
  } catch (err) {
    console.error('Execution error:', err);
    return res.status(500).json({
      success: false,
      verdict: 'Internal Error',
      type: 'Internal Error',
      error: 'An internal error occurred during code execution',
      executionTime: 0,
      memoryUsed: 0,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Compiler service running on port ${PORT}`);
});