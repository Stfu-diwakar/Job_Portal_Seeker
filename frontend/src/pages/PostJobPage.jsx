import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createJob } from '../services/api';
import { PlusCircle, Building2, MapPin, DollarSign, Layers, ArrowRight, AlertCircle, CheckCircle2, Compass } from 'lucide-react';
import MagneticCard from '../components/MagneticCard';

const PostJobPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: 'Remote',
    type: 'Full-Time',
    salary: '$130,000 - $160,000',
    category: 'Engineering',
    experienceLevel: 'Mid Level',
    description: '',
    requirements: '',
    tags: 'React, Node.js, TypeScript',
    featured: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.company || !formData.description) {
      setError('Title, company, and description are required.');
      return;
    }

    setLoading(true);

    try {
      await createJob({
        ...formData,
        requirements: formData.requirements ? formData.requirements.split('\n').filter(Boolean) : [],
        tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()) : []
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/jobs');
      }, 1500);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to post job. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container py-5 text-center">
        <div className="glass-panel p-5 mx-auto" style={{ maxWidth: 620, background: '#0e121b' }}>
          <Building2 size={48} className="text-primary mb-3" />
          <h3 className="text-white fw-bold mb-2">Recruiter Authentication Required</h3>
          <p className="mb-4" style={{ color: '#cbd5e1' }}>
            You must be signed in with a valid JWT session to publish new opportunities to the Seeker network.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/login" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 fw-semibold">
              Sign In
            </Link>
            <Link to="/register" className="btn btn-outline-light rounded-pill px-4 fw-semibold">
              Register as Recruiter
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <MagneticCard className="p-4 p-md-5" style={{ background: '#0e121b' }}>
            <div className="text-center mb-4">
              <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-3 py-1" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                SEEKER HIRING
              </span>
              <h2 className="text-white fw-bold mb-1">Post a New Tech Opening</h2>
              <p className="small" style={{ color: '#cbd5e1' }}>Publish your vacancy to reach top-tier verified software engineers.</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success py-2 small d-flex align-items-center gap-2 mb-3">
                <CheckCircle2 size={16} /> Job posted successfully! Redirecting to jobs portal...
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control filter-input"
                    placeholder="e.g. Senior Frontend Architect"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Company Name</label>
                  <input
                    type="text"
                    name="company"
                    className="form-control filter-input"
                    placeholder="e.g. Stripe, OpenAI, Scale AI"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control filter-input"
                    placeholder="e.g. Remote or San Francisco, CA"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Employment Type</label>
                  <select
                    name="type"
                    className="form-select filter-input"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Remote">Remote</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Category</label>
                  <select
                    name="category"
                    className="form-select filter-input"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Design & UI">Design & UI</option>
                    <option value="AI & Data">AI & Data</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Security">Security</option>
                  </select>
                </div>
              </div>

              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Salary Compensation</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control filter-input"
                    placeholder="e.g. $140,000 - $180,000"
                    value={formData.salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Experience Level</label>
                  <select
                    name="experienceLevel"
                    className="form-select filter-input"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Lead / Staff">Lead / Staff</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Job Description</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control filter-input"
                  placeholder="Describe the mission, key responsibilities, team architecture..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Key Requirements (One per line)</label>
                <textarea
                  name="requirements"
                  rows="3"
                  className="form-control filter-input"
                  placeholder="3+ years of React experience&#10;Proficiency in Node.js Express APIs&#10;Experience with Docker & Cloud CI/CD"
                  value={formData.requirements}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Tech Stack Tags (Comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  className="form-control filter-input"
                  placeholder="React, Node.js, TypeScript, PostgreSQL, Docker"
                  value={formData.tags}
                  onChange={handleChange}
                />
              </div>

              <div className="form-check mb-4">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  className="form-check-input"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                <label htmlFor="featured" className="form-check-label small fw-semibold" style={{ color: '#cbd5e1' }}>
                  Promote as Featured Listing (Prioritized on landing page & top of search)
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-magnetic btn-magnetic w-100 py-2.5 rounded-pill d-flex align-items-center justify-content-center gap-2 fw-semibold"
              >
                {loading ? 'Publishing...' : 'Publish Job Listing'} <ArrowRight size={16} />
              </button>
            </form>
          </MagneticCard>
        </div>
      </div>
    </div>
  );
};

export default PostJobPage;
