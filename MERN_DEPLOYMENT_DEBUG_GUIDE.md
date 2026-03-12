# 🔧 Complete MERN Stack Deployment & Debugging Guide

## 📋 Summary of Fixes Applied

### ✅ Frontend Changes

#### 1. Fixed `.env.local` (Local Development)
**Before:** Had production URL (wrong!)
```
VITE_API_URL=https://fullstack-jobportal-1.onrender.com/api
```

**After:** Commented out to use Vite proxy
```
# VITE_API_URL=http://localhost:5000/api
```

#### 2. Enhanced `api.js` with Debug Logs
Added console logging to show:
- API base URL being used
- Environment mode (development/production)
- Jobs API response structure
- Error details

#### 3. Enhanced `JobsPage.jsx` with Debug Logs
Added console logging to show:
- When jobs are being fetched
- Response structure
- Jobs array length
- Parse errors if any

#### 4. Enhanced Backend `jobController.js`
Added console logging to show:
- Query parameters received
- Filters applied
- Jobs count in database
- Jobs returned

### ✅ Backend Configuration
- Improved CORS logging
- Validates CORS origin format

---

## 🚀 Deployment Configuration

### For Vercel Frontend

**Environment Variable to Set:**

1. Go to **Vercel Dashboard** → Your Project → **Settings**
2. Click **Environment Variables**
3. Add:

| Name | Value | Environments |
|------|-------|---|
| `VITE_API_URL` | `https://fullstack-jobportal-1.onrender.com/api` | Production, Preview |

4. **Redeploy** your project after setting the variable

### For Render Backend

**Environment Variable to Set:**

1. Go to **Render Dashboard** → Backend Project → **Environment**
2. Ensure this is set correctly:

| Name | Value |
|------|-------|
| `FRONTEND_URL` | `https://fullstack-jobportal.vercel.app` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Your JWT secret key |

---

## 🐛 Debugging Steps

### Step 1: Check Frontend Logs
1. Visit your Vercel frontend: https://fullstack-jobportal.vercel.app
2. Open browser DevTools: **F12 → Console tab**
3. Look for logs like:
   ```
   API_BASE_URL: https://fullstack-jobportal-1.onrender.com/api
   Environment: production
   ```

### Step 2: Check Network Requests
1. In DevTools, go to **Network tab**
2. Refresh the page
3. Look for request to `/api/jobs` or `fullstack-jobportal-1.onrender.com/api/jobs`
4. Check:
   - ✓ Status: 200 (or similar success code)
   - ✓ Response has `{"jobs": [...], "page": 1, "pages": 1}`
   - ✗ If 403/CORS error → backend CORS needs fixing
   - ✗ If 404 → backend not running

### Step 3: Check Backend Logs
1. Go to **Render Dashboard**
2. Select your backend project
3. Click **Logs** tab
4. Look for:
   ```
   Get jobs request - Query params: {}
   Jobs count: X
   Returning X jobs (page 1)
   ```

### Step 4: Manual API Test
In browser console on Vercel site, run:
```javascript
fetch('https://fullstack-jobportal-1.onrender.com/api/jobs')
  .then(r => r.json())
  .then(d => console.log('Response:', d))
  .catch(e => console.error('Error:', e))
```

---

## ✨ Response Structure Verification

Your backend should return:
```json
{
  "jobs": [
    {
      "_id": "...",
      "title": "Senior Developer",
      "company": "Tech Corp",
      "location": "New York",
      "type": "Full-time",
      "category": "Technology",
      "description": "...",
      "salary": "$100k-150k",
      "postedDate": "2024-03-12T...",
      "employer": {
        "_id": "...",
        "name": "John Doe",
        "company": "Tech Corp"
      }
    }
    // more jobs...
  ],
  "page": 1,
  "pages": 5
}
```

Frontend correctly processes this with:
```javascript
setJobs(response.data.jobs);  // ✓ Correct
setFilteredJobs(response.data.jobs);  // ✓ Correct
```

---

## 🔍 Common Issues & Fixes

### ❌ Issue: "No jobs found" but backend has jobs

**Cause 1: VITE_API_URL not set in Vercel**
- Check Vercel Environment Variables are set
- Redeploy project after setting

**Cause 2: Backend CORS blocking**
- Check Render logs for CORS errors  
- Verify FRONTEND_URL is correct with https://

**Cause 3: API using wrong URL**
- Open DevTools Console
- Check if `API_BASE_URL` is correct
- Check Network tab - where are requests going?

### ❌ Issue: CORS Errors in Console

**The fix already applied handles this - ensure:**
- Backend CORS origin includes `https://`
- `FRONTEND_URL` on Render = `https://fullstack-jobportal.vercel.app`

### ❌ Issue: 404 on API Call

**Check:**
1. Backend is running on Render
2. Use this command to test:
   ```bash
   curl https://fullstack-jobportal-1.onrender.com/api/jobs
   ```

---

## 📝 Local Development Testing

Before deploying changes:

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run dev
# Runs on http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 with proxy to backend
```

**In browser console, you should see:**
```
API_BASE_URL: /api
Environment: development
```

The proxy routes `/api` to `http://localhost:5000/api` automatically.

---

## ✅ Testing Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Vercel
- [ ] `VITE_API_URL` set in Vercel environment variables
- [ ] `FRONTEND_URL` set in Render environment variables
- [ ] Browser console shows correct API_BASE_URL
- [ ] Network tab shows successful /api/jobs request (status 200)
- [ ] Response has jobs array with data
- [ ] Jobs display in UI (not "No jobs found")
- [ ] Filters work correctly
- [ ] Can register/login
- [ ] Can apply to jobs

---

## 🎯 Quick Action Items

1. **Verify Vercel has environment variable:**
   - Dashboard → Project Settings → Environment Variables
   - Add/Update: `VITE_API_URL=https://fullstack-jobportal-1.onrender.com/api`
   - Redeploy

2. **Verify Render has environment variable:**
   - Dashboard → Backend Project → Environment
   - Ensure: `FRONTEND_URL=https://fullstack-jobportal.vercel.app`

3. **Wait for deployments to complete:**
   - Check Render Logs for "successfully deployed"
   - Check Vercel Deployments for completion

4. **Test:**
   - Open Vercel frontend
   - Open DevTools Console
   - Look for console logs with API info
   - Check Network tab for /api/jobs request

---

## 🆘 Still Not Working?

1. Open DevTools → Console tab
2. Screenshot the console logs
3. Go to Network tab
4. Take screenshot showing /api/jobs request
5. Check response in Network tab
6. Compare with expected response structure above
7. Check Render backend logs

This will help identify exactly where the issue is.
