# Job Portal - Full Stack Application

A modern, responsive job portal built with React (frontend) and Node.js/Express (backend), featuring user authentication, job management, and application tracking.

## 🚀 Features

### Frontend (React + Vite)
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Job Search & Filtering**: Advanced search by title, company, location, type, and category
- **User Authentication**: JWT-based login/register system
- **Job Management**: View detailed job listings, save jobs, apply with resume uploads
- **Dark Mode**: Toggle between light and dark themes
- **Real-time Updates**: Live data from backend APIs

### Backend (Node.js + Express)
- **RESTful API**: Complete API for jobs, users, and applications
- **Authentication**: JWT tokens with secure password hashing
- **Database**: MongoDB Atlas cloud database
- **File Uploads**: Resume uploads to Cloudinary cloud storage
- **Email Notifications**: Automated emails for job applications
- **Role-based Access**: Separate permissions for job seekers and employers

## 🛠️ Tech Stack

### Frontend
- React 19.2.0
- React Router DOM 7.13.0
- Tailwind CSS 4.1.18
- Axios for API calls
- Vite for build tooling

### Backend
- Node.js with Express 5.2.1
- MongoDB Atlas
- JWT for authentication
- Cloudinary for file storage
- Nodemailer for emails
- Multer for file handling

## 📁 Project Structure

```
job-portal/
├── frontend/          # React application
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # API service functions
│   │   └── data/        # Sample data (legacy)
│   └── package.json
├── backend/           # Node.js API server
│   ├── config/        # Database and cloud configs
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Auth middleware
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API routes
│   ├── seeders/       # Database seeders
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account (for email notifications)
- Cloudinary account (for file uploads)

### Installation

1. **Clone and setup frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

2. **Setup backend:**
   ```bash
   cd backend
   npm install
   # Configure .env file (see Environment Variables below)
   npm run data:import  # Seed database
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

## 🔧 Environment Variables

A few variables are required for both backend and frontend:

### Backend (`backend/.env`)

```env
PORT=5000
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/your_database?appName=your_app_name
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
# used by CORS middleware to allow the frontend origin
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (`frontend/.env` or set in Vercel dashboard)

```
VITE_API_URL=https://your-backend.onrender.com
```

The React app reads `VITE_API_URL` at build time; a default of `/api` is used for local development with the Vite dev server proxy.

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filtering)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employers only)
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/my` - Get user's applications
- `GET /api/applications/employer` - Get employer's applications
- `PUT /api/applications/:id` - Update application status

## 🚀 Deployment

### Frontend (Vercel)
1. Connect the GitHub repository to Vercel and select the `frontend` folder.
2. Framework preset: **Vite** (the defaults usually work).
3. Build command: `npm run build` and output directory `dist`.
4. Set the environment variable `VITE_API_URL` to your Render backend URL.
5. (Optional) configure a custom domain once deployed.

### Backend (Render)
1. Connect the GitHub repository to Render and create a **Web Service**.
2. Set the root to the `backend` directory, build command `npm install`, start command `npm start`.
   - Render does **not** need the `build` script; that command is intended for local
   development when you want to bundle the frontend inside the backend.
3. Add environment variables listed above, including `FRONTEND_URL`.
4. For auto-deploys, link a branch (e.g. `main`) and enable deploy on push.
5. The service will expose a public URL such as `https://your-backend.onrender.com`.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Your Name** - *Initial work* - [Your GitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- React community
- Tailwind CSS team
- MongoDB Atlas
- Cloudinary
