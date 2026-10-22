import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Radio,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  Compass,
  Award,
  ChevronRight
} from 'lucide-react';
import MagneticCard from '../components/MagneticCard';
import JobCard from '../components/JobCard';
import JobModal from '../components/JobModal';
import { getJobs, applyForJob, getMyApplications } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getJobs();
        setFeaturedJobs(jobs.slice(0, 4));

        if (isAuthenticated) {
          try {
            const myApps = await getMyApplications();
            const ids = new Set(myApps.map((a) => (typeof a.jobId === 'object' ? a.jobId?._id : a.jobId)));
            setAppliedJobIds(ids);
          } catch (e) {
            console.warn('Failed to fetch user applications:', e.message);
          }
        }
      } catch (err) {
        console.error('Failed to load featured jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleApplySubmit = async (jobId, details) => {
    await applyForJob(jobId, details);
    setAppliedJobIds((prev) => new Set([...prev, jobId]));
  };

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION WITH MAGNETIC CANVAS BACKGROUND */}
      <section className="hero-wrapper text-center">
        <div className="container">
          {/* Pill Badge */}
          <div className="d-inline-flex mb-4">
            <div className="badge-pill-brand">
              <span className="pulse-dot"></span>
              <span className="fw-bold text-white">Seeker Platform</span>
              <span className="opacity-40">|</span>
              <span style={{ color: '#38bdf8' }}>Vetted Engineering Openings</span>
            </div>
          </div>

          {/* Main Title */}
          <h1 className="hero-title mx-auto" style={{ maxWidth: 940 }}>
            Discover Your Next Mission in <br />
            <span className="gradient-primary">High-Velocity Tech.</span>
          </h1>

          {/* Subtitle with High-Contrast Legibility */}
          <p className="hero-subtitle">
            Seeker bridges ambitious software engineers with world-class engineering teams. Experience zero-friction 1-click applications, cryptographically secure JWT authentication, and live status transparency.
          </p>

          {/* Interactive Hero Search Bar */}
          <div className="row justify-content-center mb-4">
            <div className="col-lg-8 col-md-10">
              <form onSubmit={handleHeroSearch} className="glass-panel p-2.5 d-flex flex-column flex-sm-row gap-2 align-items-center" style={{ background: '#0e121b' }}>
                <div className="d-flex align-items-center gap-2 flex-grow-1 px-3 w-100">
                  <Search size={20} className="text-info flex-shrink-0" />
                  <input
                    type="text"
                    className="form-control bg-transparent border-0 text-white shadow-none"
                    placeholder="Search role, keyword (e.g. React, Node, Cloud, AI)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ fontSize: '1rem', color: '#ffffff' }}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-2.5 w-100 w-sm-auto flex-shrink-0 fw-semibold"
                >
                  Explore Jobs <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Filter Tags */}
          <div className="d-flex flex-wrap justify-content-center align-items-center gap-2 mb-4">
            <span className="small me-2 fw-semibold" style={{ color: '#cbd5e1' }}>Trending Tech:</span>
            {['React', 'Node.js', 'Full Stack', 'Remote', 'AI Systems', 'DevOps'].map((tag, idx) => (
              <button
                key={idx}
                onClick={() => navigate(`/jobs?search=${tag}`)}
                className="btn btn-sm rounded-pill py-1 px-3 fw-semibold"
                style={{
                  fontSize: '0.82rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#cbd5e1'
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Platform Performance Stats Banner */}
          <div className="stats-banner mx-auto" style={{ maxWidth: 900 }}>
            <div className="stat-item">
              <div className="stat-value text-primary">10,000+</div>
              <div className="stat-label">Verified Tech Roles</div>
            </div>
            <div className="stat-item border-start border-secondary border-opacity-25 ps-lg-4">
              <div className="stat-value" style={{ color: '#38bdf8' }}>98.4%</div>
              <div className="stat-label">Response Guarantee</div>
            </div>
            <div className="stat-item border-start border-secondary border-opacity-25 ps-lg-4">
              <div className="stat-value text-success">48 hrs</div>
              <div className="stat-label">Avg Review Speed</div>
            </div>
            <div className="stat-item border-start border-secondary border-opacity-25 ps-lg-4">
              <div className="stat-value" style={{ color: '#fbbf24' }}>Zero</div>
              <div className="stat-label">Ghosting Policy</div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE PROPOSITION - 3D MAGNETIC CARDS */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-3 py-1.5" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
              WHY CHOOSE SEEKER
            </span>
            <h2 className="text-white fs-1 mb-2 fw-bold">Built for Engineering Velocity</h2>
            <p className="mx-auto" style={{ maxWidth: 640, color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Say goodbye to black-hole job applications and tedious 50-field ATS forms. Seeker is built by engineers, for engineers.
            </p>
          </div>

          <div className="row g-4">
            {/* Card 1 */}
            <div className="col-md-6 col-lg-3">
              <MagneticCard className="p-4 h-100 d-flex flex-column">
                <div
                  className="mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(99, 102, 241, 0.2)',
                    border: '1px solid rgba(99, 102, 241, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Zap size={26} className="text-primary" />
                </div>
                <h4 className="text-white fw-bold mb-2">Instant 1-Click Apply</h4>
                <p className="small mb-0 flex-grow-1" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  Skip repetitive questionnaires. Store your credentials and portfolio once to apply to verified positions in seconds.
                </p>
              </MagneticCard>
            </div>

            {/* Card 2 */}
            <div className="col-md-6 col-lg-3">
              <MagneticCard className="p-4 h-100 d-flex flex-column">
                <div
                  className="mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ShieldCheck size={26} style={{ color: '#38bdf8' }} />
                </div>
                <h4 className="text-white fw-bold mb-2">Stateless JWT Security</h4>
                <p className="small mb-0 flex-grow-1" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  Cryptographically signed JSON Web Tokens paired with 10-round bcrypt password hashing keep your session and identity protected.
                </p>
              </MagneticCard>
            </div>

            {/* Card 3 */}
            <div className="col-md-6 col-lg-3">
              <MagneticCard className="p-4 h-100 d-flex flex-column">
                <div
                  className="mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(139, 92, 246, 0.2)',
                    border: '1px solid rgba(139, 92, 246, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Radio size={26} style={{ color: '#c084fc' }} />
                </div>
                <h4 className="text-white fw-bold mb-2">Real-Time Status Radar</h4>
                <p className="small mb-0 flex-grow-1" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  Track every submission along the pipeline from "Submitted" to "Under Review", "Shortlisted", and "Accepted" with zero ghosting.
                </p>
              </MagneticCard>
            </div>

            {/* Card 4 */}
            <div className="col-md-6 col-lg-3">
              <MagneticCard className="p-4 h-100 d-flex flex-column">
                <div
                  className="mb-4"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <TrendingUp size={26} className="text-success" />
                </div>
                <h4 className="text-white fw-bold mb-2">Upfront Compensation</h4>
                <p className="small mb-0 flex-grow-1" style={{ color: '#cbd5e1', lineHeight: 1.6 }}>
                  Every opportunity clearly displays verified compensation brackets, equity allocations, and remote flexibility terms.
                </p>
              </MagneticCard>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROLES SHOWCASE */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex flex-column flex-md-row align-items-start align-items-md-end justify-content-between mb-4">
            <div>
              <span className="badge bg-info bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-3 py-1.5" style={{ fontSize: '0.76rem', fontWeight: 700 }}>
                CURATED POSITIONS
              </span>
              <h2 className="text-white fs-2 mb-1 fw-bold">Featured Opportunities</h2>
              <p className="mb-0" style={{ color: '#cbd5e1' }}>Direct openings from top-tier engineering organizations.</p>
            </div>
            <Link to="/jobs" className="btn btn-outline-light rounded-pill px-4 mt-3 mt-md-0 d-inline-flex align-items-center gap-2 fw-semibold">
              Browse All Jobs ({featuredJobs.length}+) <ArrowRight size={16} />
            </Link>
          </div>

          <div className="row g-4">
            {featuredJobs.map((job) => (
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
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="py-5 mb-4">
        <div className="container">
          <div
            className="p-5 text-center position-relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(6, 182, 212, 0.18) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              borderRadius: 20
            }}
          >
            <h2 className="text-white fw-bold fs-1 mb-3">Ready to Land Your Next Role?</h2>
            <p className="mx-auto mb-4" style={{ maxWidth: 580, color: '#e2e8f0', fontSize: '1.05rem', lineHeight: 1.6 }}>
              Join developers using Seeker to accelerate their careers with transparent compensation, verified job posts, and real-time tracking.
            </p>
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/jobs" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-2.5 fw-semibold">
                Browse Tech Jobs <ArrowRight size={16} />
              </Link>
              {!isAuthenticated && (
                <Link to="/register" className="btn btn-outline-light rounded-pill px-4 py-2.5 fw-semibold">
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Modal */}
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

export default LandingPage;
