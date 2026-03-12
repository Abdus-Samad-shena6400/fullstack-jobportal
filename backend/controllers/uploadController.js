const path = require('path');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload a file to Cloudinary and return its URL
// @route   POST /api/upload
// @access  Public (or protected if you prefer)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const localPath = path.resolve(req.file.path);
    console.log('Uploading file from local path:', localPath);
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'resumes',
      resource_type: 'auto',
    });

    // cleanup local file after uploading
    fs.unlink(req.file.path, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({ message: 'Upload failed' });
  }
};

module.exports = {
  uploadFile,
};
