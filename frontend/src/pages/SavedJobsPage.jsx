import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import { jobsAPI } from '../services/api';

const SavedJobsPage = () => {
  const [savedJobs, setSavedJobs] = useState(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  const [savedJobsData, setSavedJobsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSavedJobs = async () => {
      if (savedJobs.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // For now, fetch all jobs and filter locally
        // In a real app, you'd have an endpoint to fetch jobs by IDs
        const response = await jobsAPI.getJobs();
        const allJobs = response.data.jobs;
        const savedJobsList = allJobs.filter(job => savedJobs.includes(job._id));
        setSavedJobsData(savedJobsList);
      } catch (err) {
        setError('Failed to load saved jobs');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSavedJobs();
  }, [savedJobs]);

  const handleSaveToggle = (jobId) => {
    const updatedSavedJobs = savedJobs.filter(id => id !== jobId);
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce text-6xl mb-4">💾</div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Loading saved jobs...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error loading saved jobs</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                <svg className="w-10 h-10 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Your Saved Jobs
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Keep track of jobs you're interested in and apply when you're ready
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{savedJobsData.length}</div>
                <div className="text-sm text-red-600 dark:text-red-400">Saved Jobs</div>
              </div>
            </div>
          </div>
        </div>

        {savedJobsData.length > 0 ? (
          <>
            <div className="mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-blue-800 dark:text-blue-200 text-sm">
                    Your saved jobs are stored locally and will persist across browser sessions.
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedJobsData.map((job, index) => (
                <div
                  key={job.id}
                  className="slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <JobCard
                    job={job}
                    isSaved={true}
                    onSaveToggle={handleSaveToggle}
                  />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="text-8xl mb-4 animate-bounce">📂</div>
              <div className="absolute -top-2 -right-2 text-4xl animate-pulse">💔</div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              No saved jobs yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
              Start building your dream career! Save jobs you're interested in to keep them here for easy access and quick application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/jobs"
                className="btn-primary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Browse Jobs
              </a>
              <a
                href="/"
                className="btn-secondary inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Go Home
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedJobsPage;