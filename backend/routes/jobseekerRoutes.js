const express = require('express');
const { protect, jobseekerOnly } = require('../middleware/auth');
const { getMyApplications } = require('../controllers/applicationController');

const router = express.Router();

// @route GET /api/jobseeker/applications
// @access Private (jobseeker only)
router.get('/applications', protect, jobseekerOnly, getMyApplications);

module.exports = router;