import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsAPI, applicationsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * JobDetailsPage Component
 * 
 * REFRESH HANDLING: When user refreshes the page:
 * 1. Vercel routing (vercel.json) redirects to /index.html
 * 2. React Router extracts job ID from URL (/job/:id)
 * 3. useParams() retrieves the ID
 * 4. useEffect fetches fresh data from API
 * 5. No more 404 errors on refresh!
 */
const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [job, setJob] = useState(null);
  const [savedJobs, setSavedJobs] = useState(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: null,
    resumeUrl: '', // For URL-based resumes instead of file uploads
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  /**
   * Fetch job details when component mounts or ID changes
   * Handles 404 gracefully when job is not found or deleted
   */
  useEffect(() => {
    const fetchJob = async () => {
      try {
        if (!id) {
          setError('No job ID provided');
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        console.log('🔍 Loading job details for ID:', id);
        
        const response = await jobsAPI.getJob(id);
        console.log('✅ Job loaded successfully:', response.data?.title);
        
        setJob(response.data);
        setIsSaved(savedJobs.includes(response.data._id));
        setError(null);
      } catch (err) {
        console.error('❌ Failed to load job:', err);
        
        if (err.response?.status === 404) {
          setError('This job no longer exists or has been removed.');
        } else if (err.response?.status === 500) {
          setError('Server error. Please try again later.');
        } else if (err.message === 'Job ID is required') {
          setError('Invalid job ID');
        } else {
          setError(err.response?.data?.message || 'Failed to load job details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJob();
  }, [id, savedJobs]);

  const handleSaveToggle = () => {
    const jobId = job._id;
    const updatedSavedJobs = isSaved
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(updatedSavedJobs);
    setIsSaved(!isSaved);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role === 'employer') {
      alert('Employers cannot apply to jobs');
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required field
    if (!applicationData.coverLetter.trim()) {
      setSubmitError('Cover letter is required');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      /**
       * Resume Handling Strategy:
       * - If user uploaded a file: use FormData (traditional file upload)
       * - If user provided a URL: send as JSON with URL string
       * - If neither: send without resume (optional field)
       * 
       * This supports:
       * 1. Direct file uploads (if backend enables)
       * 2. URL references (e.g., Google Drive, Dropbox, S3)
       * 3. No resume (optional field)
       */
      
      const formData = new FormData();
      formData.append('jobId', job._id);
      formData.append('coverLetter', applicationData.coverLetter);
      
      // Handle resume - either file or URL
      if (applicationData.resume) {
        // File upload case
        formData.append('resume', applicationData.resume);
        console.log('📎 Submitting application with file upload');
      } else if (applicationData.resumeUrl?.trim()) {
        // URL case - add to FormData as string
        formData.append('resumeUrl', applicationData.resumeUrl.trim());
        console.log('🔗 Submitting application with resume URL:', applicationData.resumeUrl);
      } else {
        console.log('📝 Submitting application without resume');
      }

      console.log('✉️ Submitting application to job:', job._id);
      await applicationsAPI.apply(formData);
      
      console.log('✅ Application submitted successfully!');
      alert('Application submitted successfully!');
      setShowApplicationModal(false);
      setApplicationData({ coverLetter: '', resume: null, resumeUrl: '' });
    } catch (error) {
      console.error('❌ Failed to submit application:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">💼</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading job details...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error loading job</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link to="/jobs" className="btn-primary">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Job not found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The job you're looking for doesn't exist or has been removed.</p>
          <Link to="/jobs" className="btn-primary">
            Browse All Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/jobs"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-6 transition-colors duration-200 group"
        >
          <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Jobs
        </Link>

        {/* Job Header */}
        <div className="card p-8 mb-8 slide-up">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
            <div className="flex-1 mb-6 lg:mb-0">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mr-4">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{job.company}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {job.location}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveToggle}
                className={`btn-secondary inline-flex items-center ${
                  isSaved ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800' : ''
                }`}
                aria-label={isSaved ? `Remove ${job.title} from saved jobs` : `Save ${job.title} to saved jobs`}
              >
                <svg className="w-5 h-5 mr-2" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {isSaved ? 'Saved' : 'Save Job'}
              </button>
              <button
                onClick={handleApplyClick}
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Apply Now
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
              </svg>
              {job.type}
            </span>
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {job.category}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="card p-8 slide-up" style={{ animationDelay: '200ms' }}>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Job Description
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="card p-8 slide-up" style={{ animationDelay: '400ms' }}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Requirements
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.requirements}
              </p>
            </div>

            {/* Responsibilities */}
            <div className="card p-8 slide-up" style={{ animationDelay: '600ms' }}>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Responsibilities
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {job.responsibilities}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Company Info */}
            <div className="card p-6 slide-up" style={{ animationDelay: '800ms' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">About {job.company}</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-lg font-bold mr-3">
                  {job.company.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{job.company}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Leading {job.category.toLowerCase()} company</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {job.company} is a leading company in the {job.category.toLowerCase()} industry, committed to innovation and excellence.
                We offer a dynamic work environment where employees can grow and develop their careers.
              </p>
            </div>

            {/* Quick Actions */}
            <div className="card p-6 slide-up" style={{ animationDelay: '1000ms' }}>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={handleApplyClick}
                  className="w-full btn-primary"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSaveToggle}
                  className={`w-full btn-secondary ${
                    isSaved ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : ''
                  }`}
                >
                  {isSaved ? 'Remove from Saved' : 'Save Job'}
                </button>
                <button className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white underline text-sm">
                  Report this job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Apply to {job.title}
                </h2>
                <button
                  onClick={() => setShowApplicationModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleApplicationSubmit} className="space-y-6">
                {/* Job Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {job.company} • {job.location}
                  </p>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
                    {submitError}
                  </div>
                )}

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    value={applicationData.coverLetter}
                    onChange={(e) => setApplicationData({ ...applicationData, coverLetter: e.target.value })}
                    placeholder="Write a brief introduction about yourself and why you're interested in this position..."
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white h-32"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Resume/CV (Optional)
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    Choose one option below:
                  </p>
                  
                  {/* File Upload Option */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Upload File (PDF, DOC, DOCX)
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => {
                        setApplicationData({ 
                          ...applicationData, 
                          resume: e.target.files[0],
                          resumeUrl: '' // Clear URL if file is selected
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  {/* Resume URL Option */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Or paste Resume URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/my-resume.pdf"
                      value={applicationData.resumeUrl}
                      onChange={(e) => {
                        setApplicationData({ 
                          ...applicationData, 
                          resumeUrl: e.target.value,
                          resume: null // Clear file if URL is entered
                        });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Use URLs from Google Drive, Dropbox, GitHub, or any public hosting
                    </p>
                  </div>
                </div>

                {/* Selected File Info */}
                {applicationData.resume && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      ✓ File selected: {applicationData.resume.name}
                    </p>
                  </div>
                )}

                {/* Selected URL Info */}
                {applicationData.resumeUrl && !applicationData.resume && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-4 py-3 rounded-lg">
                    <p className="text-sm text-green-700 dark:text-green-400">
                      ✓ Resume URL set: {applicationData.resumeUrl}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowApplicationModal(false)}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetailsPage;