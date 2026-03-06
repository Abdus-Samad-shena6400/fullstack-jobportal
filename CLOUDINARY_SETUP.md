# Cloudinary Configuration Guide

To enable resume uploads, you need to set up Cloudinary credentials in your `.env` file. Use the following template:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

## How to Get Cloudinary Credentials

1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Go to Dashboard → Settings → API Keys
4. Copy your Cloud Name, API Key, and API Secret

## ✅ What’s Already Done
- The `.env` file in the `backend` folder has placeholders for Cloudinary credentials.
- The `applicationController.js` includes error handling to gracefully skip uploads if credentials are invalid.
- File uploads are optional; if credentials fail, applications still submit successfully.

## 📝 How to Verify
1. Restart the backend server:
   ```bash
   cd backend
   npm start
   ```
2. Submit an application with a resume – it should upload and the backend log will show a success message.
3. If something still fails, check the console for `Cloudinary upload error:` messages.

## 🔄 Changing Credentials Later
If you ever need to update the keys again:
1. Edit `backend/.env` with new values.
2. Restart the backend server.

The system uses `process.env` on startup, so a restart is required for changes to take effect.

---

Good luck with your new Cloudinary setup — inshaAllah it will work smoothly! 🎉