# Quick Commands for Frontend Deployment to Vercel

## Fastest Way (CLI):

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

## Environment Variable to Set in Vercel:

**Name:** `VITE_API_URL`
**Value:** `https://fullstack-jobportal-1.onrender.com/api`

Then redeploy the project from Vercel dashboard.

---

## Code Changes Made:

✅ **Already optimized** - Your frontend already uses `VITE_API_URL` environment variable!

Files created for reference:
- `.env.example` - Shows what variables are needed
- `.env.local` - Local development config (for reference)

---

## Backend CORS Configuration:

Make sure your Render backend has the frontend URL added to CORS when you have the Vercel URL.

Update backend `.env`:
```
FRONTEND_URL=https://your-vercel-url.vercel.app
```

Or use `*` temporarily for testing (not recommended for production).
