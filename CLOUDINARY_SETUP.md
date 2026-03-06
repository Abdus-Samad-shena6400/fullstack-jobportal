# Cloudinary Configuration Guide

The project now includes valid Cloudinary credentials you provided. Use the following details in your `.env` file to enable resume uploads:

```
CLOUDINARY_CLOUD_NAME=samad
CLOUDINARY_API_KEY=191152148814654
CLOUDINARY_API_SECRET=0ZoUkxSOjXBxicDr2uQbTSYhE_U
```

## ✅ What’s Already Done
- The `.env` file in the `backend` folder now contains the above Cloudinary credentials.
- The `applicationController.js` was restored and includes error handling to gracefully skip uploads if something goes wrong.
- File uploads are optional; if the credentials ever fail, applications still submit.

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