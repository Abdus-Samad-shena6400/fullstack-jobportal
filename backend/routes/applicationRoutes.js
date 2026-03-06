const express = require('express');
const multer = require('multer');
const path = require('path');
const {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
} = require('../controllers/applicationController');
const { protect, employerOnly } = require('../middleware/auth');

const router = express.Router();

// Multer config for file uploads
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
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: PDFs and DOCs only!');
    }
  },
});

// @route   POST /api/applications
router.post('/', protect, upload.single('resume'), applyForJob);

// @route   GET /api/applications/my
router.get('/my', protect, getMyApplications);

// @route   GET /api/applications/employer
router.get('/employer', protect, employerOnly, getEmployerApplications);

// @route   PUT /api/applications/:id
router.put('/:id', protect, employerOnly, updateApplicationStatus);

module.exports = router;