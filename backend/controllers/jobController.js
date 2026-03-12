const Job = require('../models/Job');
const { validationResult } = require('express-validator');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    console.log('Get jobs request - Query params:', req.query);

    const keyword = req.query.keyword
      ? {
          $or: [
            { title: { $regex: req.query.keyword, $options: 'i' } },
            { company: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const filters = {};
    if (req.query.type) filters.type = req.query.type;
    if (req.query.category) filters.category = req.query.category;
    if (req.query.location) filters.location = { $regex: req.query.location, $options: 'i' };

    console.log('Filters applied:', filters);

    const count = await Job.countDocuments({ ...keyword, ...filters, isActive: true });
    console.log('Jobs count:', count);

    const jobs = await Job.find({ ...keyword, ...filters, isActive: true })
      .populate('employer', 'name company')
      .sort({ postedDate: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    console.log(`Returning ${jobs.length} jobs (page ${page})`);
    res.json({ jobs, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    console.error('Error in getJobs:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('employer', 'name email');
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a job
// @route   POST /api/jobs
// @access  Private/Employer
const createJob = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, company, location, type, category, description, requirements, responsibilities, salary } = req.body;

  try {
    const job = new Job({
      title,
      company,
      location,
      type,
      category,
      description,
      requirements,
      responsibilities,
      salary,
      employer: req.user._id,
    });

    const createdJob = await job.save();
    res.status(201).json(createdJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a job
// @route   PUT /api/jobs/:id
// @access  Private/Employer
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to update this job' });
      }

      job.title = req.body.title || job.title;
      job.company = req.body.company || job.company;
      job.location = req.body.location || job.location;
      job.type = req.body.type || job.type;
      job.category = req.body.category || job.category;
      job.description = req.body.description || job.description;
      job.requirements = req.body.requirements || job.requirements;
      job.responsibilities = req.body.responsibilities || job.responsibilities;
      job.salary = req.body.salary || job.salary;

      const updatedJob = await job.save();
      res.json(updatedJob);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a job
// @route   DELETE /api/jobs/:id
// @access  Private/Employer
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (job) {
      if (job.employer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Not authorized to delete this job' });
      }

      await job.remove();
      res.json({ message: 'Job removed' });
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get jobs by employer
// @route   GET /api/jobs/employer
// @access  Private/Employer
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs,
};