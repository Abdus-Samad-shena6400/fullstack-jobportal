# Production Bug Fixes (March 2026)

This document tracks the final set of changes made to resolve four outstanding production issues after deploying the backend to Render and frontend to Vercel.

## ✅ 1. Home page job card click -> Server error
- **Problem:** `HomePage.jsx` was rendering hard‑coded `jobsData` with `id` fields; clicking a job linked to `/job/undefined` once production data (with `_id`) was used.
- **Solution:** Fetch jobs list from backend using `jobsAPI.getJobs()`.
  - Updated `HomePage.jsx` with loading/error state, `jobs` state array, and API call in `useEffect`.
  - Computed `featuredJobs`/`filteredJobs` from the API response.
  - Adjusted keys and saved logic to use `job._id || job.id`.
  - `JobsPage.jsx` and `SavedJobsPage.jsx` were also patched to prefer `_id` for keys and savedJobs.

## ✅ 2. Footer profile image 404
- **Problem:** Vercel rewrite rule was intercepting `/profile.jpeg`, returning `index.html`.
- **Solution:** Changed `frontend/vercel.json` to rewrite to `/index.html` (standard SPA fallback). static assets are now served before the rewrite.
  - No code changes needed in `Footer.jsx` (still `<img src="/profile.jpeg"/>`).

## ✅ 3. Resume upload ENOENT & backend support for URLs
- **Problem:** The front‑end originally sent a local file path string; the backend tried to `stat()` it and failed.
- **Solution:**
  1. **Backend**
     - Added `/api/upload` route (`uploadRoutes.js` + `uploadController.js`) to accept file uploads and forward them to Cloudinary.
     - `applicationController.applyForJob` now:
       - Uploads `req.file` to Cloudinary, deletes the temp file.
       - Accepts a `resumeUrl` string when no file is provided.
  2. **Frontend**
     - `api.js` now exports `uploadAPI.uploadFile()`.
     - `JobDetailsPage.jsx` was refactored so that when a user selects a file it is first uploaded via `/api/upload`; the returned URL is then included in the application payload. The applications endpoint now receives JSON only.
     - The UI still allows either file upload or pasting a URL; selecting one clears the other field.

## ✅ 4. API base URL configuration and environment variables
- Already using `API_BASE_URL = import.meta.env.VITE_API_URL || '/api'` in `services/api.js`.
- `vercel.json` and documentation were updated to emphasise setting `VITE_API_URL` in the Vercel dashboard.
- Added detailed comments and console logging to help debug any future CORS/URL issues.

---

All code changes have been committed within the workspace; redeploy both services after pulling the updates and setting the correct environment variables (`VITE_API_URL`, Cloudinary keys).

Feel free to delete `frontend/src/data/jobsData.js` once the seed data is no longer required for local development.

Good luck with the live site! 🚀