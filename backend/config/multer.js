import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Absolute path to ensure Docker compatibility
const uploadDir = path.resolve('./uploads');

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.zip', '.rar', '.7zip', '.txt'];
  if (!allowedExts.includes(ext)) {
    return cb(new Error('Only .zip, .rar, .7zip, and .txt files are allowed'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter
});

export const uploadProblemFiles = upload.fields([
  { name: 'inputFiles', maxCount: 20 },
  { name: 'outputFiles', maxCount: 20 },
  { name: 'zipFile', maxCount: 1 }
]);

export default upload;
