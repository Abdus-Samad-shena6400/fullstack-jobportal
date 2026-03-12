# Frontend Deployment to Vercel Guide

## Prerequisites
1. Frontend code is ready
2. Backend is deployed on Render: `https://fullstack-jobportal-1.onrender.com`
3. You have a Vercel account (sign up at https://vercel.com)
4. You have Git installed

## Step 1: Prepare Your Code

Your frontend is already configured to use environment variables for the API URL:
- Local development: Uses proxy from `vite.config.js` (proxies to `http://localhost:5000`)
- Production: Uses `VITE_API_URL` environment variable

## Step 2: Deploy to Vercel

### Option A: Deploy using Vercel CLI (Recommended)

```bash
# Navigate to frontend directory
cd frontend

# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the frontend
vercel
```

When prompted:
- Select "Y" to link to existing project or create new
- For build settings, use default (Vite will auto-detect)
- Framework: React
- Build Command: `npm run build`
- Output Directory: `dist`

### Option B: Deploy using GitHub Integration (Easiest for Continuous Deployment)

1. Push your code to GitHub repository
2. Go to https://vercel.com/dashboard
3. Click "Add New Project"
4. Select your GitHub repository
5. Configure settings (same as above)
6. Deploy

### Option C: Deploy using Git Repository (from Vercel Dashboard)

1. Go to https://vercel.com
2. Create new project
3. Import your Git repository
4. Configure and deploy

## Step 3: Set Environment Variables in Vercel

After deployment, you need to set the backend API URL:

1. Go to your Vercel Dashboard
2. Select your frontend project
3. Click "Settings" tab
4. Go to "Environment Variables"
5. Add the following:

**Name:** `VITE_API_URL`
**Value:** `https://fullstack-jobportal-1.onrender.com/api`

6. Make sure it's set for:
   - ✓ Production
   - ✓ Preview
   - ✓ Development (optional, for local dev with Vercel)

7. Click "Save"

**IMPORTANT:** After adding environment variables, redeploy your project:
- In the Vercel dashboard, go to "Deployments"
- Click the "..." menu on latest deployment
- Select "Redeploy"

## Step 4: Verify Deployment

1. Visit your Vercel frontend URL (you'll get it after deployment)
2. Test the following:
   - Can you see the job listings?
   - Can you login/register?
   - Can you create a job posting (as employer)?
   - Can you apply to jobs?

## Troubleshooting

### CORS Issues
If you see CORS errors:
- Check that `VITE_API_URL` is correctly set in Vercel environment variables
- Check that your backend CORS configuration includes your Vercel URL

### API Not Found
- Verify the Render URL is correct: `https://fullstack-jobportal-1.onrender.com`
- Check if Render backend is running
- Make sure environment variable is set to `https://fullstack-jobportal-1.onrender.com/api` (with `/api` at the end)

### Build Fails
- Check that all dependencies are installed: `npm install`
- Verify `package.json` scripts are correct
- Check for any build errors in Vercel logs

## Your Frontend Environment Variables

| Variable Name | Value | Where |
|---|---|---|
| `VITE_API_URL` | `https://fullstack-jobportal-1.onrender.com/api` | Vercel Environment Variables |

## Local Development

To test locally:
```bash
cd frontend
npm install
npm run dev
```

This will start the dev server with the proxy, so no need to set `VITE_API_URL` locally.

## NextSteps

After successful deployment:
1. Update your backend CORS to include Vercel URL
2. Test all features thoroughly
3. Monitor Vercel analytics for performance
4. Set up error tracking (optional)
