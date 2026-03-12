const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

/**
 * Temporary file storage configuration
 * Files are saved to /uploads directory temporarily, then uploaded to Cloudinary and deleted
 */
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for temporary disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

// File filter: only allow resume-related file types
const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
  ];
  
  const allowedExtensions = /\.(pdf|doc|docx|png|jpg|jpeg)$/i;
  
  const mimeValid = allowedMimes.includes(file.mimetype);
  const extValid = allowedExtensions.test(path.extname(file.originalname));
  
  if (mimeValid && extValid) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: PDF, DOC, DOCX, PNG, JPG, JPEG`), false);
  }
};

// Initialize multer with storage, size limit, and file filter
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
  },
});

/**
 * POST /api/upload
 * Upload a resume file to Cloudinary
 * 
 * Request: Multipart FormData with 'file' field
 * Response: { url: 'https://cloudinary-public-url.com/...' }
 */
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
