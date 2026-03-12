const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadFile } = require('../controllers/uploadController');

const router = express.Router();

// we can reuse same disk storage as applicationRoutes or simplify
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx|png|jpg|jpeg/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Invalid file type');
    }
  },
});

// POST /api/upload
router.post('/', upload.single('file'), uploadFile);

module.exports = router;
