const path = require('path');
const fs = require('fs');
const cloudinary = require('../config/cloudinary');

/**
 * Upload a file to Cloudinary
 * 
 * Process:
 * 1. Receive file from multipart FormData
 * 2. Validate file exists on disk
 * 3. Upload to Cloudinary
 * 4. Delete temporary file
 * 5. Return Cloudinary public URL
 * 
 * @route   POST /api/upload
 * @access  Public
 * @returns { url: 'https://...' }
 */
const uploadFile = async (req, res) => {
  const localPath = req.file ? path.resolve(req.file.path) : null;
  
  try {
    // 1. Validate file was received
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No file uploaded. Please select a file to upload.',
        code: 'NO_FILE' 
      });
    }

    console.log(`📎 File received: ${req.file.originalname} (${req.file.size} bytes)`);
    console.log(`📂 Stored at: ${localPath}`);

    // 2. Validate file exists on disk before uploading
    if (!localPath || !fs.existsSync(localPath)) {
      console.error(`❌ File not found at: ${localPath}`);
      return res.status(400).json({ 
        message: 'File not found. Please try uploading again.',
        code: 'FILE_NOT_FOUND' 
      });
    }

    // 3. Check Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === 'missing') {
      console.error('❌ Cloudinary not configured. Missing CLOUDINARY_CLOUD_NAME');
      return res.status(500).json({ 
        message: 'Server configuration error: Cloudinary not properly configured. Please contact support.',
        code: 'CLOUDINARY_CONFIG_ERROR' 
      });
    }

    // 4. Upload to Cloudinary
    console.log(`☁️  Uploading to Cloudinary...`);
    const cloudinaryResult = await cloudinary.uploader.upload(localPath, {
      folder: 'job-portal/resumes',
      resource_type: 'auto',
      public_id: `${Date.now()}-${req.file.originalname.split('.')[0]}`,
    });

    console.log(`✅ Upload successful: ${cloudinaryResult.secure_url}`);

    // 5. Clean up temporary file
    fs.unlink(localPath, (err) => {
      if (err) {
        console.warn(`⚠️  Failed to delete temp file: ${localPath}`);
      } else {
        console.log(`🗑️  Cleaned up temporary file`);
      }
    });

    // 6. Return the public URL to frontend
    res.json({ 
      url: cloudinaryResult.secure_url,
      public_id: cloudinaryResult.public_id,
    });

  } catch (error) {
    console.error(`❌ Upload failed:`, {
      message: error.message,
      code: error.code,
      http_code: error.http_code,
      file: req.file?.originalname,
    });

    // Clean up temporary file on error
    if (localPath && fs.existsSync(localPath)) {
      fs.unlink(localPath, (err) => {
        if (err) console.warn(`Failed to clean up temp file: ${localPath}`);
      });
    }

    // Return appropriate error response
    let statusCode = 500;
    let errorMessage = 'Upload failed. Please try again.';
    let errorCode = 'UPLOAD_ERROR';

    // Handle specific Cloudinary errors
    if (error.http_code === 400) {
      statusCode = 400;
      errorMessage = `Invalid file: ${error.message}`;
      errorCode = 'INVALID_FILE';
    } else if (error.message && error.message.includes('Invalid cloud_name')) {
      statusCode = 500;
      errorMessage = 'Server configuration error: Cloudinary cloud_name is invalid. Please contact support.';
      errorCode = 'INVALID_CLOUD_NAME';
    } else if (error.message && error.message.includes('Unauthorized')) {
      statusCode = 500;
      errorMessage = 'Server configuration error: Cloudinary credentials are invalid. Please contact support.';
      errorCode = 'CLOUDINARY_AUTH_ERROR';
    } else if (error.message?.includes('File size')) {
      statusCode = 400;
      errorMessage = 'File too large. Maximum size is 10 MB.';
      errorCode = 'FILE_TOO_LARGE';
    }

    res.status(statusCode).json({ 
      message: errorMessage,
      code: errorCode,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

module.exports = { uploadFile };
