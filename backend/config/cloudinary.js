const cloudinary = require('cloudinary').v2;

// Validate required Cloudinary environment variables
const requiredEnvVars = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing Cloudinary environment variables:', missingVars);
  console.error('Please set these in your Render Dashboard under Environment Variables:');
  console.error(missingVars.map(v => `  - ${v}`).join('\n'));
  console.warn('⚠️  File uploads will fail until these are configured!');
}

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'missing',
  api_key: process.env.CLOUDINARY_API_KEY || 'missing',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'missing',
});

// Log configuration status (without exposing secrets)
console.log('☁️  Cloudinary configured:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing',
  api_key: process.env.CLOUDINARY_API_KEY ? '✓ Set' : '✗ Missing',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '✓ Set' : '✗ Missing',
});

module.exports = cloudinary;