import React from 'react';
import { MapPin, Briefcase, DollarSign, ArrowUpRight, CheckCircle2, Clock } from 'lucide-react';
import MagneticCard from './MagneticCard';

const JobCard = ({ job, onApply, onViewDetails, isApplied = false }) => {
  const getInitials = (name) => {
    if (!name) return 'SK';
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <MagneticCard className="job-card">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div className="d-flex align-items-center gap-3">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.company}
              className="company-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div
            className="company-logo"
            style={{ display: job.companyLogo ? 'none' : 'flex' }}
          >
            {getInitials(job.company)}
          </div>

          <div>
            <h4 className="mb-1 text-white fw-bold d-flex align-items-center gap-2">
              {job.title}
              {job.featured && (
                <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-35 px-2 py-0.5" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                  FEATURED
                </span>
              )}
            </h4>
            <div className="small d-flex align-items-center gap-2" style={{ color: '#cbd5e1' }}>
              <span className="text-info fw-bold">{job.company}</span>
              <span>•</span>
              <span className="d-flex align-items-center gap-1" style={{ color: '#94a3b8' }}>
                <MapPin size={13} /> {job.location}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className="small mb-3 flex-grow-1" style={{ color: '#cbd5e1', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {job.description}
      </p>

      {/* Tags */}
      <div className="mb-3">
        {job.tags && job.tags.slice(0, 4).map((tag, idx) => (
          <span key={idx} className="job-tag">
            {tag}
          </span>
        ))}
      </div>

      {/* Meta Footer */}
      <div className="d-flex flex-wrap align-items-center justify-content-between pt-3 border-top border-secondary border-opacity-15 mt-auto gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-success fw-bold small d-flex align-items-center gap-1" style={{ fontSize: '0.9rem' }}>
            <DollarSign size={15} /> {job.salary}
          </span>
          <span className="badge bg-secondary bg-opacity-25 text-light px-2.5 py-1" style={{ fontSize: '0.74rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            {job.type}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          <button
            onClick={() => onViewDetails(job)}
            className="btn btn-sm btn-outline-light rounded-pill px-3 py-1.5 fw-semibold"
          >
            Details
          </button>

          {isApplied ? (
            <button className="btn btn-sm btn-success rounded-pill px-3.5 py-1.5 d-flex align-items-center gap-1 fw-bold" disabled>
              <CheckCircle2 size={14} /> Applied
            </button>
          ) : (
            <button
              onClick={() => onApply(job)}
              className="btn btn-sm btn-primary-magnetic btn-magnetic rounded-pill px-3.5 py-1.5 d-flex align-items-center gap-1 fw-semibold"
            >
              Apply <ArrowUpRight size={14} />
            </button>
          )}
        </div>
      </div>
    </MagneticCard>
  );
};

export default JobCard;
