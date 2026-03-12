const fs = require('fs');
const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const nodemailer = require('nodemailer');
const cloudinary = require('../config/cloudinary');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private
const applyForJob = async (req, res) => {
  const { jobId, coverLetter } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    let resumeUrl = null;

    if (req.file) {
      try {
        const localPath = path.resolve(req.file.path);
        console.log('Applying for job - uploading resume from', localPath);
        const result = await cloudinary.uploader.upload(localPath, {
          folder: 'resumes',
          resource_type: 'auto',
        });
        resumeUrl = result.secure_url;
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError.message);
        // continue without resume
      } finally {
        // remove temp file from disk
        fs.unlink(req.file.path, err => {
          if (err) console.error('Failed to delete temp resume file:', err);
        });
      }
    }

    // If no file was uploaded but frontend provided a direct URL, use it
    if (!resumeUrl && req.body.resumeUrl) {
      resumeUrl = req.body.resumeUrl;
    }

    const application = new Application({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: resumeUrl,
    });

    const createdApplication = await application.save();

    // send email notification
    const employer = await User.findById(job.employer);
    if (employer) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: employer.email,
        subject: `New Application for ${job.title}`,
        text: `A new application has been submitted for your job posting: ${job.title}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Email sent: ' + info.response);
      });
    }

    res.status(201).json(createdApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications/my
// @access  Private
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate('job', 'title company location')
      .sort({ appliedAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get applications for employer's jobs
// @route   GET /api/applications/employer
// @access  Private/Employer
const getEmployerApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user._id }).select('_id');
    const jobIds = jobs.map(job => job._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate('job', 'title company')
      .populate('applicant', 'name email')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id
// @access  Private/Employer
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;

  try {
    const application = await Application.findById(req.params.id).populate('job');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.job.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    application.status = status;
    const updatedApplication = await application.save();

    // email applicant about update
    const applicant = await User.findById(application.applicant);
    if (applicant) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: applicant.email,
        subject: `Application Status Update for ${application.job.title}`,
        text: `Your application status has been updated to: ${status}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error);
        else console.log('Status email sent: ' + info.response);
      });
    }

    res.json(updatedApplication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyForJob,
  getMyApplications,
  getEmployerApplications,
  updateApplicationStatus,
};