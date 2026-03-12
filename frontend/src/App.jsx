import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import JobsPage from './pages/JobsPage';
import JobDetailsPage from './pages/JobDetailsPage';
import SavedJobsPage from './pages/SavedJobsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EmployerDashboard from './pages/EmployerDashboard';
import JobseekerDashboard from './pages/JobseekerDashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/jobs" element={<JobsPage />} />
              <Route path="/job/:id" element={<JobDetailsPage />} />
              <Route path="/saved" element={<SavedJobsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/employer"
                element={
                  <ProtectedRoute employerOnly>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobseeker"
                element={
                  <ProtectedRoute jobseekerOnly>
                    <JobseekerDashboard />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
