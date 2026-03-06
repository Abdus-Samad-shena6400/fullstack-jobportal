import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const JobCard = ({ job, isSaved, onSaveToggle }) => {
  const [saved, setSaved] = useState(isSaved);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  useEffect(() => {
    // Trigger animation when component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveToggle = () => {
    setSaved(!saved);
    onSaveToggle(job._id || job.id);
  };

  return (
    <div
      className={`card p-6 fade-in ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      role="article"
      aria-labelledby={`job-title-${job._id || job.id}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3
            id={`job-title-${job._id || job.id}`}
            className="text-xl font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2"
          >
            <Link
              to={`/job/${job._id || job.id}`}
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              {job.title}
            </Link>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 font-medium">{job.company}</p>
          <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </div>
        </div>
        <button
          onClick={handleSaveToggle}
          className={`p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
            saved
              ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-900/20'
              : 'text-gray-400 hover:text-red-500 bg-gray-50 dark:bg-gray-700'
          }`}
          aria-label={saved ? `Remove ${job.title} from saved jobs` : `Save ${job.title} to saved jobs`}
        >
          <svg className="w-6 h-6" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V8a2 2 0 01-2 2H8a2 2 0 01-2-2V6m8 0H8" />
          </svg>
          {job.type}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          {job.category}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
        {job.description}
      </p>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Posted {new Date(job.postedDate).toLocaleDateString()}
        </div>
        <Link
          to={`/job/${job._id || job.id}`}
          className="btn-primary text-sm px-4 py-2 focus:ring-offset-2"
          aria-label={`View details for ${job.title} at ${job.company}`}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default JobCard;