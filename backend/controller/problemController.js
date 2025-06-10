import Problem from "../model/problemModel.js"
import fs from 'fs'
import AdmZip from 'adm-zip'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_BASE = '/usr/src/app/uploads';

const createProblem = async (req, res) => {
  try {
    const { role } = req.user;
    if (role !== 'admin') {
      return res.status(403).json({ success: false, message: 'You are not authorized to create a problem!' });
    }

    const { title, description, inputFormat, outputFormat, constraints, samples, difficulty, tags } = req.body;

    if (!title || !description || !inputFormat || !outputFormat || !constraints || !samples || !difficulty) {
      return res.status(400).json({ success: false, message: 'Please fill all the fields!' });
    }

    const existingProblem = await Problem.findOne({ title });
    if (existingProblem) {
      return res.status(400).json({ success: false, message: 'Problem already exists!' });
    }

    let hiddenTests = [];
    const baseFolder = `${Date.now()}_${title.replace(/\s+/g, '_')}`;
    const extractPath = path.join(UPLOADS_BASE, baseFolder);
    fs.mkdirSync(extractPath, { recursive: true });

    const walkSync = (dir, fileList = []) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) walkSync(filepath, fileList);
        else fileList.push(filepath);
      }
      return fileList;
    };

    if (req.files?.zipFile) {
      const zipFile = req.files.zipFile[0];
      const zip = new AdmZip(zipFile.path);
      zip.extractAllTo(extractPath, true);

      const allExtractedFiles = walkSync(extractPath);
      const inputFiles = allExtractedFiles.filter(f => path.basename(f).startsWith('input') && f.endsWith('.txt')).sort();
      const outputFiles = allExtractedFiles.filter(f => path.basename(f).startsWith('output') && f.endsWith('.txt')).sort();

      if (inputFiles.length !== outputFiles.length) {
        return res.status(400).json({ success: false, message: 'Number of input and output files in ZIP must match.' });
      }

      hiddenTests = inputFiles.map((inputPath, idx) => ({
        inputFilePath: path.relative('/usr/src/app', inputPath).replace(/\\/g, '/'),
        outputFilePath: path.relative('/usr/src/app', outputFiles[idx]).replace(/\\/g, '/')
      }));
    } else if (req.files?.inputFiles && req.files?.outputFiles) {
      const { inputFiles, outputFiles } = req.files;
      if (inputFiles.length !== outputFiles.length) {
        return res.status(400).json({ success: false, message: 'Input and output files must be provided in matching pairs.' });
      }

      inputFiles.forEach(file => fs.renameSync(file.path, path.join(extractPath, file.originalname)));
      outputFiles.forEach(file => fs.renameSync(file.path, path.join(extractPath, file.originalname)));

      const sortedInputs = inputFiles.map(f => path.join(extractPath, f.originalname)).sort();
      const sortedOutputs = outputFiles.map(f => path.join(extractPath, f.originalname)).sort();

      hiddenTests = sortedInputs.map((inputPath, idx) => ({
        inputFilePath: path.relative('/usr/src/app', inputPath).replace(/\\/g, '/'),
        outputFilePath: path.relative('/usr/src/app', sortedOutputs[idx]).replace(/\\/g, '/')
      }));
    }

    if (!hiddenTests.length) {
      return res.status(400).json({ success: false, message: 'No test cases found in upload.' });
    }

    const newProblem = new Problem({
      title,
      description,
      inputFormat,
      outputFormat,
      constraints,
      samples: JSON.parse(samples),
      difficulty,
      tags: tags ? JSON.parse(tags) : [],
      hiddenTests,
    });

    await newProblem.save();
    return res.status(201).json({ success: true, message: 'Problem created successfully!' });

  } catch (error) {
    console.error('🔴 Full error on problem creation:', error);
    res.status(500).json({ success: false, message: 'Problem creation failed!' });
  }
};

const getAllProblems = async (req, res) => {

    try {
        const problems = await Problem.find().select('-hiddenTests');       //sending only the just required data to the client not sending the complete data due to security reasons since the problem has hiddenTests and other sensitive data
        if(problems.length === 0) {
            return res.status(404).json({ success: false, message: 'No problems found!' })
        }
        else res.status(200).json({ success: true, problems })

    } 
    catch (error) {
        console.error('Error fetching problems:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch problems!' })
    }
}

const getProblemById = async (req, res) => {

    try {

        //sending the problem data according to the user role
        const {id} = req.params
        const {role} = req.user 
        const problem = (role==='admin') 
        ? await Problem.findById(id) 
        : await Problem.findById(id).select('-hiddenTests')

        if(problem){
            res.status(200).json({success:true,message:'problem sent successfully',problem})
        }
        else res.status(400).json({success:false,message:'No problem exists!'})
        
    } 
    catch (error) {
        console.error('Error fetching problem:', error)
        res.status(500).json({ success: false, message: 'Failed to fetch problem!' })
        
    }

}

const updateProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;
    if (role !== 'admin') return res.status(403).json({ success: false, message: 'Unauthorized' });

    const updateData = {};
    try {
      updateData.samples = JSON.parse(req.body.samples || '[]');
      updateData.tags = JSON.parse(req.body.tags || '[]');
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid JSON in samples or tags' });
    }

    ['title','description','inputFormat','outputFormat','constraints','difficulty']
      .forEach(k => { if (req.body[k]) updateData[k] = req.body[k]; });

    let retainedTests = [];
    try { retainedTests = JSON.parse(req.body.retainTestIds || '[]'); } catch {}

    const problem = await Problem.findById(id);
    if (!problem) return res.status(404).json({ success: false, message: 'Problem not found' });

    const retainedCases = (problem.hiddenTests || []).filter(t => retainedTests.includes(String(t._id)));
    let newTests = [];

    const baseFolder = `${Date.now()}_${(problem.title || 'updated').replace(/\s+/g, '_')}`;
    const extractPath = path.join(UPLOADS_BASE, baseFolder);
    fs.mkdirSync(extractPath, { recursive: true });

    const walkSync = (dir, list = []) => {
      for (const file of fs.readdirSync(dir)) {
        const fp = path.join(dir, file);
        if (fs.statSync(fp).isDirectory()) walkSync(fp, list);
        else list.push(fp);
      }
      return list;
    };

    if (req.files?.zipFile?.length) {
      const zip = new AdmZip(req.files.zipFile[0].path);
      zip.extractAllTo(extractPath, true);
      const all = walkSync(extractPath);
      const inputs = all.filter(f => f.includes('input') && f.endsWith('.txt')).sort();
      const outputs = all.filter(f => f.includes('output') && f.endsWith('.txt')).sort();

      if (inputs.length !== outputs.length)
        return res.status(400).json({ success: false, message: 'ZIP input/output mismatch' });

      newTests = inputs.map((inF, i) => ({
        inputFilePath: path.relative('/usr/src/app', inF).replace(/\\/g, '/'),
        outputFilePath: path.relative('/usr/src/app', outputs[i]).replace(/\\/g, '/'),
      }));
      fs.unlinkSync(req.files.zipFile[0].path);
    } else if (req.files?.inputFiles?.length && req.files?.outputFiles?.length) {
      const inDest = req.files.inputFiles.map(f => {
        const dest = path.join(extractPath, f.originalname);
        fs.renameSync(f.path, dest); return dest;
      }).sort();

      const outDest = req.files.outputFiles.map(f => {
        const dest = path.join(extractPath, f.originalname);
        fs.renameSync(f.path, dest); return dest;
      }).sort();

      if (inDest.length !== outDest.length)
        return res.status(400).json({ success: false, message: 'Input/output mismatch' });

      newTests = inDest.map((d, i) => ({
        inputFilePath: path.relative('/usr/src/app', d).replace(/\\/g, '/'),
        outputFilePath: path.relative('/usr/src/app', outDest[i]).replace(/\\/g, '/'),
      }));
    }

    updateData.hiddenTests = [...retainedCases, ...newTests];
    const updated = await Problem.findByIdAndUpdate(id, { $set: updateData }, { new: true });
    return res.status(200).json({ success: true, message: 'Problem updated successfully!', updatedProblem: updated });
  } catch (err) {
    console.error('🔴 updateProblem error:', err);
    return res.status(500).json({ success: false, message: 'Problem update failed!' });
  }
};


const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    if (role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete a problem!',
      });
    }

    const problem = await Problem.findById(id);

    if (!problem) {
      return res.status(400).json({
        success: false,
        message: 'No problem exists!',
      });
    }

    // ✅ Delete associated hidden test files using resolved absolute paths
    if (problem.hiddenTests && problem.hiddenTests.length > 0) {
      for (const test of problem.hiddenTests) {
        try {
          const inputAbsPath = path.join(process.cwd(), test.inputFilePath);
          const outputAbsPath = path.join(process.cwd(), test.outputFilePath);

          if (fs.existsSync(inputAbsPath)) {
            fs.unlinkSync(inputAbsPath);
          }
          if (fs.existsSync(outputAbsPath)) {
            fs.unlinkSync(outputAbsPath);
          }
        } catch (fileError) {
          console.error(`Error deleting files:`, fileError.message);
          // Continue deletion even if file deletion fails
        }
      }
    }

    // Delete the problem from DB
    await Problem.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Problem deleted successfully!',
    });

  } catch (error) {
    console.error('Error deleting problem:', error);
    res.status(500).json({
      success: false,
      message: 'Problem deletion failed!',
    });
  }
};





export {createProblem,getAllProblems,getProblemById,updateProblem,deleteProblem}