# Job Portal Backend

A Node.js/Express backend for a job portal application with MongoDB.

## Features

- User authentication (JWT)
- Job CRUD operations
- Job applications
- File uploads for resumes
- Email notifications

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/jobportal
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

3. Start MongoDB locally or update MONGO_URI for cloud database.

4. Seed the database:
   ```bash
   npm run data:import
   ```

5. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile
- PUT /api/auth/profile

### Jobs
- GET /api/jobs
- GET /api/jobs/:id
- POST /api/jobs (Employer only)
- PUT /api/jobs/:id (Employer only)
- DELETE /api/jobs/:id (Employer only)

### Applications
- POST /api/applications
- GET /api/applications/my
- GET /api/applications/employer (Employer only)
- PUT /api/applications/:id (Employer only)

## Deployment

Deploy to Railway or similar platform. Update frontend API base URL accordingly.