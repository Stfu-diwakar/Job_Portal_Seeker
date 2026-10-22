import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApplications, getJobs, applyForJob } from '../services/api';
import {
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  User,
  Shield,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import MagneticCard from '../components/MagneticCard';

const statusStepMap = {
  'Submitted': 1,
  'Under Review': 2,
  'Shortlisted': 3,
  'Interviewing': 4,
  'Accepted': 5,
  'Rejected': 0
};

const DashboardPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quickApplying, setQuickApplying] = useState(false);

  const fetchApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Quick 1-click demo application for instant dashboard testing
  const handleQuickApplySample = async () => {
    setQuickApplying(true);
    try {
      const jobs = await getJobs();
      if (jobs.length > 0) {
        // Find a job not yet applied to
        const appliedJobIds = new Set(applications.map(a => typeof a.jobId === 'object' ? a.jobId?._id : a.jobId));
        const candidateJob = jobs.find(j => !appliedJobIds.has(j._id)) || jobs[0];

        await applyForJob(candidateJob._id, {
          coverNote: 'Excited to contribute my engineering expertise to your team!',
          resumeUrl: 'https://portfolio-bpd3.onrender.com/'
        });

        await fetchApplications();
      }
    } catch (err) {
      console.warn('Quick apply failed:', err.message);
    } finally {
      setQuickApplying(false);
    }
  };

  // Compute metrics
  const totalApplied = applications.length;
  const underReview = applications.filter(a => a.status === 'Under Review' || a.status === 'Submitted').length;
  const shortlisted = applications.filter(a => a.status === 'Shortlisted' || a.status === 'Interviewing').length;
  const accepted = applications.filter(a => a.status === 'Accepted').length;

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Submitted': return 'badge-submitted';
      case 'Under Review': return 'badge-under-review';
      case 'Shortlisted': return 'badge-shortlisted';
      case 'Interviewing': return 'badge-interviewing';
      case 'Accepted': return 'badge-accepted';
      case 'Rejected': return 'badge-rejected';
      default: return 'badge-submitted';
    }
  };

  return (
    <div className="container py-5">
      {/* Welcome Banner */}
      <div className="glass-panel p-4 p-md-5 mb-5 position-relative overflow-hidden">
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 px-3 py-1.5" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                AUTHENTICATED DASHBOARD
              </span>
              <span className="badge bg-success bg-opacity-25 text-success border border-success border-opacity-30 px-3 py-1.5" style={{ fontSize: '0.78rem', fontWeight: 700 }}>
                JWT VERIFIED
              </span>
            </div>
            <h1 className="text-white fw-bold mb-2 display-6">
              Welcome, <span className="gradient-primary">{user?.name || 'Engineer'}</span>!
            </h1>
            <p className="mb-4" style={{ maxWidth: 620, color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6, fontWeight: 450 }}>
              Track your real-time application lifecycle, monitor recruiter review stages, and explore next-generation tech career openings.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/jobs" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-2.5 fw-semibold">
                <Briefcase size={17} /> Browse Jobs
              </Link>
              <Link to="/post-job" className="btn btn-secondary-magnetic btn-magnetic rounded-pill px-4 py-2.5 fw-semibold">
                Post New Listing
              </Link>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="p-3.5 rounded-3" style={{ background: '#0e121b', border: '1px solid rgba(255, 255, 255, 0.14)' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.25)',
                    border: '1px solid rgba(99, 102, 241, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#c7d2fe'
                  }}
                >
                  <User size={24} />
                </div>
                <div>
                  <h5 className="text-white fw-bold mb-0">{user?.name || 'Candidate'}</h5>
                  <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{user?.email}</span>
                </div>
              </div>
              <div className="small mb-3 pt-2 border-top border-secondary border-opacity-20" style={{ color: '#cbd5e1' }}>
                <span style={{ color: '#94a3b8', fontWeight: 600 }}>Role:</span>{' '}
                <strong className="text-white">{user?.role === 'recruiter' ? 'Recruiter' : 'Software Engineer'}</strong>
              </div>
              {user?.skills && user.skills.length > 0 && (
                <div>
                  <div className="small mb-1.5" style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 600 }}>SKILLS:</div>
                  <div className="d-flex flex-wrap gap-1.5">
                    {user.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="badge px-2.5 py-1"
                        style={{
                          background: 'rgba(255, 255, 255, 0.08)',
                          color: '#e2e8f0',
                          border: '1px solid rgba(255, 255, 255, 0.14)',
                          fontSize: '0.78rem',
                          fontWeight: 600
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Cards - High Contrast */}
      <div className="row g-4 mb-5">
        <div className="col-sm-6 col-lg-3">
          <MagneticCard className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="dashboard-stat-label">Total Applied</span>
              <Layers size={20} className="text-primary" />
            </div>
            <div className="dashboard-stat-num">{totalApplied}</div>
          </MagneticCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <MagneticCard className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="dashboard-stat-label">In Review</span>
              <Clock size={20} className="text-warning" />
            </div>
            <div className="dashboard-stat-num text-warning">{underReview}</div>
          </MagneticCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <MagneticCard className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="dashboard-stat-label">Shortlisted</span>
              <TrendingUp size={20} style={{ color: '#c084fc' }} />
            </div>
            <div className="dashboard-stat-num" style={{ color: '#c084fc' }}>{shortlisted}</div>
          </MagneticCard>
        </div>

        <div className="col-sm-6 col-lg-3">
          <MagneticCard className="p-4">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="dashboard-stat-label">Accepted</span>
              <CheckCircle2 size={20} className="text-success" />
            </div>
            <div className="dashboard-stat-num text-success">{accepted}</div>
          </MagneticCard>
        </div>
      </div>

      {/* Applications Radar Section */}
      <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-4">
        <div>
          <h3 className="text-white fw-bold mb-1">Your Application Status Radar</h3>
          <p className="mb-0" style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Real-time status updates directly from hiring managers.
          </p>
        </div>
        <Link to="/jobs" className="btn btn-outline-light rounded-pill px-4 py-2 d-inline-flex align-items-center gap-1.5 fw-semibold" style={{ fontSize: '0.9rem' }}>
          Explore More Jobs <ArrowRight size={15} />
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading applications...</span>
          </div>
          <p className="mt-2" style={{ color: '#cbd5e1' }}>Retrieving your application radar...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : applications.length === 0 ? (
        <div className="glass-panel p-5 text-center my-3" style={{ background: '#0e121b', border: '1px solid rgba(255, 255, 255, 0.15)' }}>
          <div
            className="mx-auto mb-3"
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Briefcase size={32} className="text-primary" />
          </div>
          <h4 className="text-white fw-bold mb-2">Ready to Start Your Career Search?</h4>
          <p className="mx-auto mb-4" style={{ maxWidth: 520, color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
            You haven't submitted any job applications yet. Discover verified positions at leading tech teams like Stripe, OpenAI, and Figma, and apply with 1-click.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <Link to="/jobs" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-2.5 fw-semibold">
              <Briefcase size={16} /> Browse Verified Openings
            </Link>
            <button
              onClick={handleQuickApplySample}
              disabled={quickApplying}
              className="btn btn-secondary-magnetic btn-magnetic rounded-pill px-4 py-2.5 fw-semibold d-inline-flex align-items-center gap-2"
            >
              <Sparkles size={16} className="text-warning" />
              {quickApplying ? 'Submitting Sample...' : 'Quick Apply to Sample Role'}
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {applications.map((app) => {
            const job = app.jobId || {};
            const step = statusStepMap[app.status] || 1;

            return (
              <div key={app._id} className="col-12">
                <div className="glass-panel p-4" style={{ background: '#0e121b' }}>
                  <div className="row g-4 align-items-center">
                    {/* Job Details */}
                    <div className="col-lg-5">
                      <div className="d-flex align-items-center gap-2 mb-2">
                        <span className={`badge-status ${getStatusBadgeClass(app.status)}`}>
                          {app.status}
                        </span>
                        <span style={{ color: '#94a3b8', fontSize: '0.82rem', fontWeight: 500 }}>
                          Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-white fw-bold mb-1">{job.title || 'Tech Role'}</h4>
                      <div className="small d-flex flex-wrap align-items-center gap-2 mb-2" style={{ color: '#cbd5e1' }}>
                        <strong className="text-info">{job.company || 'Company'}</strong>
                        <span>•</span>
                        <span>{job.location || 'Remote'}</span>
                        <span>•</span>
                        <span className="text-success fw-bold">{job.salary || 'Competitive'}</span>
                      </div>
                      {app.coverNote && (
                        <p className="small mb-0 fst-italic" style={{ color: '#94a3b8' }}>
                          "{app.coverNote}"
                        </p>
                      )}
                    </div>

                    {/* Visual Progression Radar */}
                    <div className="col-lg-7">
                      <div className="d-flex justify-content-between align-items-center position-relative px-2">
                        {/* Connecting Line */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '18px',
                            left: '6%',
                            right: '6%',
                            height: 2,
                            background: 'rgba(255, 255, 255, 0.15)',
                            zIndex: 1
                          }}
                        />

                        {['Submitted', 'Under Review', 'Shortlisted', 'Interviewing', 'Accepted'].map((stage, idx) => {
                          const stageNum = idx + 1;
                          const isCompleted = step >= stageNum;
                          const isCurrent = step === stageNum;

                          return (
                            <div key={stage} className="text-center position-relative" style={{ zIndex: 2 }}>
                              <div
                                className="mx-auto mb-2"
                                style={{
                                  width: 36,
                                  height: 36,
                                  borderRadius: '50%',
                                  background: isCompleted ? '#6366f1' : '#141824',
                                  border: isCurrent ? '2px solid #38bdf8' : (isCompleted ? '2px solid #818cf8' : '2px solid rgba(255, 255, 255, 0.2)'),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#ffffff',
                                  fontSize: '0.85rem',
                                  fontWeight: 700,
                                  boxShadow: isCurrent ? '0 0 14px rgba(56, 189, 248, 0.65)' : 'none'
                                }}
                              >
                                {isCompleted ? <CheckCircle2 size={18} /> : stageNum}
                              </div>
                              <span
                                className="d-none d-sm-block"
                                style={{
                                  fontSize: '0.76rem',
                                  color: isCompleted ? '#ffffff' : '#94a3b8',
                                  fontWeight: isCurrent ? 800 : (isCompleted ? 600 : 500)
                                }}
                              >
                                {stage}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
