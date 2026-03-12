import { useState, useEffect } from 'react';
import JobCard from '../components/JobCard';
import FilterSidebar from '../components/FilterSidebar';
import { jobsAPI } from '../services/api';

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [savedJobs, setSavedJobs] = useState(JSON.parse(localStorage.getItem('savedJobs') || '[]'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    types: [],
    categories: [],
    locations: []
  });

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        console.log('Fetching jobs...');
        const response = await jobsAPI.getJobs();
        console.log('Response structure:', response);
        console.log('Response data:', response.data);
        console.log('Jobs array:', response.data.jobs);
        
        if (response.data.jobs && Array.isArray(response.data.jobs)) {
          setJobs(response.data.jobs);
          setFilteredJobs(response.data.jobs);
          console.log(`Successfully set ${response.data.jobs.length} jobs`);
        } else {
          console.error('Unexpected response structure:', response.data);
          setError('Invalid response format from server');
        }
      } catch (err) {
        setError('Failed to load jobs');
        console.error('Jobs fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Filter and search jobs
  useEffect(() => {
    let result = jobs;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.types.length > 0) {
      result = result.filter(job => filters.types.includes(job.type));
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      result = result.filter(job => filters.categories.includes(job.category));
    }

    // Apply location filter
    if (filters.locations.length > 0) {
      result = result.filter(job => filters.locations.some(loc =>
        job.location.toLowerCase().includes(loc.toLowerCase())
      ));
    }

    // Apply sorting
    if (sortBy === 'latest') {
      result = result.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    }

    setFilteredJobs(result);
  }, [jobs, searchTerm, filters, sortBy]);

  const handleSaveToggle = (jobId) => {
    const updatedSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    setSavedJobs(updatedSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Discover Your Next Opportunity
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Find the perfect job that matches your skills and aspirations
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredJobs.length}</div>
                <div className="text-sm text-blue-600 dark:text-blue-400">Jobs Found</div>
              </div>
            </div>
          </div>

          {/* Search and Sort */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by job title, company, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  aria-label="Search jobs"
                />
              </div>
              <div className="flex items-center gap-4">
                <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input-field"
                  aria-label="Sort jobs"
                >
                  <option value="latest">Latest</option>
                  <option value="oldest">Oldest</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <FilterSidebar filters={filters} onFilterChange={setFilters} />
          </div>

          {/* Jobs Grid */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600 dark:text-gray-300">Loading jobs...</span>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map((job, index) => (
                  <div
                    key={job._id || job.id}
                    className="slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <JobCard
                      job={job}
                      isSaved={savedJobs.includes(job._id || job.id)}
                      onSaveToggle={handleSaveToggle}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="text-8xl mb-6">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-md mx-auto">
                  We couldn't find any jobs matching your criteria. Try adjusting your search terms or filters.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilters({ types: [], categories: [], locations: [] });
                  }}
                  className="btn-primary"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;