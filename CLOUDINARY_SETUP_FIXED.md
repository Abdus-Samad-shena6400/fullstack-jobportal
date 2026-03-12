# Cloudinary Resume Upload - Complete Fix Guide

## Overview
You have **three critical issues** to resolve:
1. **Invalid cloud_name** error → Cloudinary environment variables not set on Render
2. **Resume file uploads** → Now properly configured to use Cloudinary + temporary disk storage
3. **Frontend FormData handling** → Enhanced with better error messages

---

## What I Fixed in Your Code

### Backend Changes

#### 1. **config/cloudinary.js** - Enhanced Configuration
```javascript
// Now validates environment variables and logs configuration status
// Shows clear error messages if variables are missing
```
**What it does:**
- Validates that `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` are set
- Logs which variables are missing (critical for debugging)
- Returns helpful error messages about what needs to be configured

#### 2. **routes/uploadRoutes.js** - Improved Multer Setup
```javascript
// Cleaner configuration with:
// - Better file type validation (MIME + extension)
// - 10 MB file size limit
// - Detailed comments explaining the flow
```
**What it does:**
- Accepts: PDF, DOC, DOCX, PNG, JPG, JPEG
- Rejects files over 10 MB
- Stores temporarily in `/uploads` directory
- Files are deleted after Cloudinary upload succeeds

#### 3. **controllers/uploadController.js** - Production-Ready Error Handling
```javascript
// Comprehensive error handling for:
// - Missing Cloudinary configuration
// - Invalid Cloudinary credentials
// - File validation errors
// - Detailed logging at each step
```
**What it does:**
- Checks if file was uploaded
- Validates file exists on disk
- Validates Cloudinary is configured
- Uploads to Cloudinary with proper folder structure
- Cleans up temporary file after upload
- Returns detailed error messages (not generic ones)

### Frontend Changes

#### **src/pages/JobDetailsPage.jsx** - Enhanced Upload Handling
- Better logging of each upload step
- Shows file size before uploading
- Catches specific upload errors
- Returns early if upload fails (prevents silent failures)
- Provides user-friendly error messages

---

## Required Actions

### Step 1: Set Environment Variables on Render

Your Render backend is throwing "Invalid cloud_name samad" because the environment variables are not configured.

1. Go to your Render Dashboard: https://dashboard.render.com
2. Find your backend service (job-portal or similar)
3. Click **Environment** in the sidebar
4. Add these three variables:

| Key | Value | Example |
|-----|-------|---------|
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `duxxxxxxxx` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | `xxxxxxxxxxxxx` |

**Where to find these values:**
1. Go to https://cloudinary.com/console/settings/api-keys
2. Log in to your Cloudinary account
3. Copy your:
   - **Cloud Name** (top of the page)
   - **API Key** (under Authentication)
   - **API Secret** (under Authentication)

### Step 2: Redeploy Backend

After setting environment variables:

1. Click **Manual Deploy** → **Deploy latest commit**
2. Wait for deployment to complete
3. Check logs: You should see `☁️  Cloudinary configured:` with checkmarks ✓

### Step 3: Redeploy Frontend

The frontend code has been updated:

1. Commit and push the changes
2. Vercel will auto-deploy
3. Or manually trigger deployment in Vercel Dashboard

### Step 4: Test the Upload

1. Go to your deployed frontend
2. Browse to any job
3. Click "Apply Now"
4. Choose a PDF or DOC file to upload
5. Submit the form

**Check browser console for logs:**
```
📎 Starting file upload: resume.pdf
   - File type: application/pdf
   - File size: 250.45 KB
☁️  Uploading to Cloudinary...
✅ Upload successful! Cloudinary URL: https://res.cloudinary.com/...
📝 Submitting application WITH resume URL
✉️  Submitting to /api/applications: {...}
✅ Application submitted successfully!
```

---

## Troubleshooting

### Error: "Invalid cloud_name samad"
**Cause:** Environment variables not set on Render
**Solution:** 
1. Go to Render Dashboard
2. Add the three Cloudinary variables
3. Redeploy backend
4. Check logs for ✓ marks

### Error: "File not found on disk"
**Cause:** Multer stored file but uploadController can't find it
**Solution:**
1. Check `/uploads` directory exists on Render
2. Check file permissions
3. Check Render logs for exact path

### Error: "Cloudinary not properly configured"
**Cause:** CLOUDINARY_CLOUD_NAME is missing or set to "missing"
**Solution:**
- Same as "Invalid cloud_name" above

### File uploads work locally but not on Render
**Most likely:** Environment variables not set on Render in step 1

### Upload succeeds but URL is not returned
**Cause:** Cloudinary response format mismatch
**Check:**
1. Browser console: What's in the upload response?
2. Backend logs: What did Cloudinary return?

---

## File Upload Flow (Updated)

```
User selects resume file
    ↓
Frontend validates file (client-side)
    ↓
FormData.append('file', resumeFile)
    ↓
POST /api/upload (FormData)
    ↓
Backend multer receives file
    ↓
Multer validates file type + size
    ↓
Multer stores in /uploads directory temporarily
    ↓
uploadController.uploadFile handler
    ↓
Validates file exists on disk
    ↓
Validates Cloudinary is configured
    ↓
cloudinary.uploader.upload()/
    ↓
Cloudinary returns secure_url
    ↓
Delete temp file from /uploads
    ↓
Return { url: "https://cloudinary.com/..." }
    ↓
Frontend receives URL
    ↓
Submit application with resumeUrl
    ↓
Backend saves application with URL
    ↓
✅ Success!
```

---

## Key Configuration Values

### Multer (uploadRoutes.js)
- **Max file size:** 10 MB
- **Allowed types:** PDF, DOC, DOCX, PNG, JPG, JPEG
- **Temp storage:** `/backend/uploads/`

### Cloudinary Upload (uploadController.js)
- **Folder:** `job-portal/resumes`
- **Resource type:** `auto` (handles any file type)
- **Cleanup:** Temp file deleted after upload

### Timeout Settings (api.js frontend)
- **Axios timeout:** 30 seconds (for Render free tier)

---

## API Endpoints

### POST /api/upload
**Request:** FormData with `file` field
```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);
POST /api/upload
```

**Success Response (200):**
```json
{
  "url": "https://res.cloudinary.com/..../v1234567890/resume.pdf",
  "public_id": "job-portal/resumes/1234567890-resume"
}
```

**Error Response (400/500):**
```json
{
  "message": "Invalid file: File exceeds max size",
  "code": "FILE_TOO_LARGE",
  "details": "Optional error details in development"
}
```

---

## Security Notes

✅ **What's protected:**
- File type validation (MIME + extension)
- File size limits (10 MB max)
- Files deleted from server after Cloudinary upload
- Cloudinary handles secure storage

⚠️ **Important:**
- Keep API secrets in environment variables (NEVER in code)
- Render's Environment section is encrypted
- Cloudinary API secret is NOT sent to frontend (only returned URL)

---

## Next Steps

1. **Now:** Set environment variables on Render (5 min)
2. **Then:** Redeploy backend (1 min)
3. **Then:** Redeploy frontend (auto or manual)
4. **Finally:** Test file upload in deployed app

**If you get stuck:**
1. Check Render logs for Cloudinary configuration messages
2. Open browser console (F12) during upload
3. Look for the detailed error messages
4. Reference this guide's troubleshooting section
