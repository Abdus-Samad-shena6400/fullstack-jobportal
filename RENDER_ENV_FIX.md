# 🔧 Render Backend Environment Variables Setup

Your Vercel frontend is at: **https://fullstack-jobportal.vercel.app**

## Update Your Render Backend Environment Variables

**CRITICAL ISSUE FIXED:** Your backend CORS was rejecting the frontend URL because the format was wrong.

### Steps to Fix:

1. Go to **Render Dashboard** → Your Backend Project
2. Click **"Environment"** tab on the left sidebar  
3. Update/Add the following variables:

| Variable Name | Current Value | New Value (CORRECT) |
|---|---|---|
| `FRONTEND_URL` | `fullstack-jobportal.vercel.app` | `https://fullstack-jobportal.vercel.app` |

**KEY CHANGE:** Add `https://` at the beginning!

4. After updating, your deployment will auto-redeploy
5. Wait for deployment to complete (check status)

### Other Important Variables (Keep as-is or update if needed):

```
NODE_ENV=production
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
CLOUDINARY_NAME=<your-cloudinary-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
PORT=5000
```

## What Was Fixed:

✅ **CORS Configuration** - Now accepts URLs with or without protocol
✅ **Credentials Support** - Added to allow cookies/auth headers
✅ **Methods & Headers** - Properly configured for all request types

## Test After Updating:

1. Go to your Vercel frontend: https://fullstack-jobportal.vercel.app
2. Click **Register**
3. Fill in the form and submit
4. Should now work without CORS errors ✓

## If Still Getting Errors:

1. Check Render deployment logs for errors
2. Check browser DevTools Console → Network tab
3. Verify the FRONTEND_URL exactly matches your Vercel URL
