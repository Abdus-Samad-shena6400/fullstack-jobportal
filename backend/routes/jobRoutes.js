const express = require('express');
const { body } = require('express-validator');
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
} = require('../controllers/jobController');
const { protect, employerOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/jobs
router.get('/', getJobs);

// @route   GET /api/jobs/:id
router.get('/:id', getJobById);

// @route   POST /api/jobs
router.post(
  '/',
  protect,
  employerOnly,
  [
    body('title', 'Title is required').not().isEmpty(),
    body('company', 'Company is required').not().isEmpty(),
    body('location', 'Location is required').not().isEmpty(),
    body('type', 'Type is required').isIn(['Full-time', 'Part-time', 'Remote']),
    body('category', 'Category is required').isIn(['Technology', 'Design', 'Data', 'Marketing', 'Product']),
    body('description', 'Description is required').not().isEmpty(),
    body('requirements', 'Requirements is required').not().isEmpty(),
    body('responsibilities', 'Responsibilities is required').not().isEmpty(),
  ],
  createJob
);

// @route   PUT /api/jobs/:id
router.put('/:id', protect, employerOnly, updateJob);

// @route   DELETE /api/jobs/:id
router.delete('/:id', protect, employerOnly, deleteJob);

// @route   GET /api/jobs/employer
router.get('/employer/jobs', protect, employerOnly, getEmployerJobs);

module.exports = router;