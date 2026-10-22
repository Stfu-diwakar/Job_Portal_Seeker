import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, Briefcase, RefreshCw, AlertCircle } from 'lucide-react';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import { getJobs, applyForJob, getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Engineering', 'Design & UI', 'AI & Data', 'DevOps', 'Security'];
const jobTypes = ['All', 'Full-Time', 'Remote', 'Contract', 'Part-Time'];
const experienceLevels = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Staff'];

const JobsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());

  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [type, setType] = useState('All');
  const [experience, setExperience] = useState('All');

  // Fetch jobs
  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category && category !== 'All') params.category = category;
      if (type && type !== 'All') params.type = type;
      if (experience && experience !== 'All') params.experience = experience;

      const data = await getJobs(params);
      setJobs(data);

      if (isAuthenticated) {
        try {
          const myApps = await getMyApplications();
          const ids = new Set(myApps.map((a) => (typeof a.jobId === 'object' ? a.jobId?._id : a.jobId)));
          setAppliedJobIds(ids);
        } catch (e) {
          console.warn('Could not load user applied jobs:', e.message);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to fetch jobs. Please verify server connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [category, type, experience]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleApplySubmit = async (jobId, details) => {
    await applyForJob(jobId, details);
    setAppliedJobIds((prev) => new Set([...prev, jobId]));
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="mb-4">
        <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-3 py-1.5" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
          EXPLORE OPENINGS
        </span>
        <h1 className="text-white fw-bold mb-1">Browse Tech Opportunities</h1>
        <p style={{ color: '#cbd5e1', fontSize: '1rem' }}>
          Discover and apply to vetted engineering, architecture, and AI positions with transparent compensation.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="filter-container mb-4">
        <form onSubmit={handleSearchSubmit} className="row g-3 align-items-center mb-3">
          <div className="col-lg-6 col-md-12">
            <div className="d-flex align-items-center gap-2 filter-input">
              <Search size={18} className="text-info flex-shrink-0" />
              <input
                type="text"
                className="bg-transparent border-0 text-white w-100 shadow-none"
                placeholder="Search by title, skill (e.g. React, Node, Python) or company..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ color: '#ffffff' }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="btn btn-sm text-secondary p-0"
                  style={{ color: '#cbd5e1' }}
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <select
              className="form-select filter-input"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="All">All Job Types</option>
              {jobTypes.filter(t => t !== 'All').map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="col-sm-6 col-lg-3">
            <select
              className="form-select filter-input"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option value="All">All Experience Levels</option>
              {experienceLevels.filter(exp => exp !== 'All').map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
        </form>

        {/* Category Pills */}
        <div className="d-flex flex-wrap gap-2 pt-2 border-top border-secondary border-opacity-15">
          <span className="small align-self-center me-2 fw-semibold" style={{ color: '#cbd5e1' }}>Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`filter-pill ${category === cat ? 'active' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="small fw-semibold" style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>
          Showing <strong className="text-white">{jobs.length}</strong> available openings
        </div>
        <button
          onClick={fetchJobs}
          className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 d-flex align-items-center gap-1.5 fw-semibold"
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      {/* Job Grid / List */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading jobs...</span>
          </div>
          <p className="small mt-2" style={{ color: '#cbd5e1' }}>Loading verified job postings...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="glass-panel p-5 text-center my-4" style={{ background: '#0e121b' }}>
          <Briefcase size={48} className="text-muted mb-3 opacity-60" />
          <h4 className="text-white fw-bold mb-2">No Matching Jobs Found</h4>
          <p className="small mb-3" style={{ color: '#cbd5e1' }}>
            Try adjusting your search criteria, clearing keywords, or switching categories.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setType('All');
              setExperience('All');
            }}
            className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 fw-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {jobs.map((job) => (
            <div key={job._id} className="col-lg-6">
              <JobCard
                job={job}
                isApplied={appliedJobIds.has(job._id)}
                onApply={handleApplyClick}
                onViewDetails={handleApplyClick}
              />
            </div>
          ))}
        </div>
      )}

      {/* Job Details / Apply Modal */}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          isApplied={appliedJobIds.has(selectedJob._id)}
          onClose={() => setSelectedJob(null)}
          onApplySubmit={handleApplySubmit}
        />
      )}
    </div>
  );
};

export default JobsPage;
