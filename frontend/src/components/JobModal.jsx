import React, { useState } from 'react';
import { X, MapPin, DollarSign, Briefcase, CheckCircle2, AlertCircle, ArrowRight, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';

const JobModal = ({ job, onClose, onApplySubmit, isApplied = false }) => {
  const { isAuthenticated, user } = useAuth();
  const [coverNote, setCoverNote] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [appliedSuccess, setAppliedSuccess] = useState(isApplied);
  const [errorMessage, setErrorMessage] = useState('');

  if (!job) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      await onApplySubmit(job._id, {
        coverNote,
        resumeUrl,
        portfolioUrl
      });
      setAppliedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="custom-modal-backdrop" onClick={onClose}>
      <div className="custom-modal p-4" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="d-flex align-items-start justify-content-between mb-4 pb-3 border-bottom border-secondary border-opacity-20">
          <div>
            <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-2.5 py-1" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
              {job.category}
            </span>
            <h3 className="text-white fw-bold mb-1">{job.title}</h3>
            <div className="small d-flex flex-wrap align-items-center gap-3 mt-1" style={{ color: '#cbd5e1' }}>
              <span className="text-info fw-bold">{job.company}</span>
              <span>•</span>
              <span className="d-flex align-items-center gap-1" style={{ color: '#94a3b8' }}>
                <MapPin size={13} /> {job.location}
              </span>
              <span>•</span>
              <span className="text-success fw-bold d-flex align-items-center gap-1">
                <DollarSign size={14} /> {job.salary}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-sm btn-outline-secondary rounded-circle p-2"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mb-4">
          <h6 className="text-uppercase small fw-bold mb-2" style={{ color: '#38bdf8', letterSpacing: '0.06em' }}>
            Job Description
          </h6>
          <p className="mb-4" style={{ color: '#cbd5e1', lineHeight: 1.6, fontSize: '0.96rem' }}>
            {job.description}
          </p>

          {job.requirements && job.requirements.length > 0 && (
            <div className="mb-4">
              <h6 className="text-uppercase small fw-bold mb-2" style={{ color: '#38bdf8', letterSpacing: '0.06em' }}>
                Requirements & Qualifications
              </h6>
              <ul className="list-unstyled mb-0">
                {job.requirements.map((req, idx) => (
                  <li key={idx} className="d-flex align-items-start gap-2 mb-2 small" style={{ color: '#cbd5e1', lineHeight: 1.5 }}>
                    <CheckCircle2 size={16} className="text-success flex-shrink-0 mt-1" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="d-flex flex-wrap gap-2 mb-4">
            {job.tags && job.tags.map((tag, idx) => (
              <span key={idx} className="badge bg-dark border border-secondary border-opacity-30 px-3 py-1.5" style={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Application Section */}
        <div className="p-3.5 rounded-3 bg-dark border border-secondary border-opacity-30">
          {appliedSuccess ? (
            <div className="text-center py-3">
              <CheckCircle2 size={48} className="text-success mb-2" />
              <h4 className="text-white fw-bold mb-1">Application Submitted!</h4>
              <p className="small mb-3" style={{ color: '#cbd5e1' }}>
                Your application for <strong>{job.title}</strong> has been transmitted to {job.company}'s hiring team. Track the review stage in your Seeker dashboard.
              </p>
              <button onClick={onClose} className="btn btn-outline-light rounded-pill px-4 fw-semibold">
                Close Modal
              </button>
            </div>
          ) : !isAuthenticated ? (
            <div className="text-center py-3">
              <h5 className="text-white fw-bold mb-2">Sign in to apply with 1-Click</h5>
              <p className="small mb-3" style={{ color: '#cbd5e1' }}>
                Join Seeker to submit applications directly and track your status in real time.
              </p>
              <a href="/login" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 fw-semibold">
                Sign In to Apply
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h5 className="text-white fw-bold mb-2 d-flex align-items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Submit Your Application
              </h5>
              <p className="small mb-3" style={{ color: '#cbd5e1' }}>
                Applying as <strong className="text-info">{user?.name}</strong> ({user?.email})
              </p>

              {errorMessage && (
                <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                  <AlertCircle size={16} /> {errorMessage}
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Brief Note to Hiring Manager (Optional)</label>
                <textarea
                  className="form-control filter-input"
                  rows="3"
                  placeholder="Share what makes you an exceptional candidate for this role..."
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                />
              </div>

              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Resume URL / Portfolio Link</label>
                  <input
                    type="url"
                    className="form-control filter-input"
                    placeholder="https://yourprofile.dev/resume.pdf"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                  />
                </div>
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>GitHub / LinkedIn URL</label>
                  <input
                    type="url"
                    className="form-control filter-input"
                    placeholder="https://github.com/yourhandle"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end gap-2">
                <button type="button" onClick={onClose} className="btn btn-outline-secondary rounded-pill px-3.5 py-1.5 fw-semibold">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-1.5 d-flex align-items-center gap-2 fw-semibold"
                >
                  {submitting ? 'Submitting...' : 'Confirm Application'} <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobModal;
