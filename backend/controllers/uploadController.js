const path = require('path');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Upload a file to Cloudinary and return its URL
// @route   POST /api/upload
// @access  Public (or protected if you prefer)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      console.error('Upload error: no file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    console.log('File received for upload:', req.file.filename, 'at', req.file.path);

    const localPath = path.resolve(req.file.path);
    console.log('Resolved absolute path:', localPath);

    // verify file actually exists before uploading
    if (!fs.existsSync(localPath)) {
      console.error('File not found at path:', localPath);
      return res.status(400).json({ message: 'File not found on disk' });
    }

    console.log('Uploading to Cloudinary from:', localPath);
    const result = await cloudinary.uploader.upload(localPath, {
      folder: 'resumes',
      resource_type: 'auto',
    });

    console.log('Cloudinary upload success:', result.secure_url);

    // cleanup local file after uploading
    fs.unlink(localPath, (err) => {
      if (err) console.error('Failed to delete temp file:', err);
    });

    // return in the format the frontend expects
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error.message, error.code);
    res.status(500).json({ message: 'Upload failed: ' + error.message });
  }
};

module.exports = {
  uploadFile,
};
