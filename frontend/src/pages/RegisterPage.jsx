import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, AlertCircle, ArrowRight, Briefcase, Compass } from 'lucide-react';
import MagneticCard from '../components/MagneticCard';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'jobseeker',
    title: 'Full Stack Engineer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage('All Fields Required');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <MagneticCard className="p-4 p-md-5" style={{ background: '#0e121b' }}>
            {/* Header */}
            <div className="text-center mb-4">
              <div
                className="mx-auto mb-3"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)'
                }}
              >
                <Compass size={24} color="#ffffff" />
              </div>
              <span className="badge bg-primary bg-opacity-25 text-info border border-info border-opacity-30 mb-2 px-3 py-1" style={{ fontSize: '0.74rem', fontWeight: 700 }}>
                JOIN SEEKER
              </span>
              <h2 className="text-white fw-bold mb-1">Create Account</h2>
              <p className="small" style={{ color: '#cbd5e1' }}>Register to unlock 1-click applications and real-time status radar.</p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Full Name</label>
                <div className="d-flex align-items-center filter-input">
                  <User size={16} className="text-info me-2 flex-shrink-0" />
                  <input
                    type="text"
                    name="name"
                    className="bg-transparent border-0 text-white w-100 shadow-none"
                    placeholder="e.g. Diwakar Jha"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ color: '#ffffff' }}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Email Address</label>
                <div className="d-flex align-items-center filter-input">
                  <Mail size={16} className="text-info me-2 flex-shrink-0" />
                  <input
                    type="email"
                    name="email"
                    className="bg-transparent border-0 text-white w-100 shadow-none"
                    placeholder="diwakar@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    style={{ color: '#ffffff' }}
                  />
                </div>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Account Role</label>
                  <select
                    name="role"
                    className="form-select filter-input"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="jobseeker">Jobseeker / Candidate</option>
                    <option value="recruiter">Recruiter / Employer</option>
                  </select>
                </div>

                <div className="col-sm-6">
                  <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Professional Headline</label>
                  <input
                    type="text"
                    name="title"
                    className="form-control filter-input"
                    placeholder="e.g. Full Stack Engineer"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Password</label>
                <div className="d-flex align-items-center filter-input">
                  <Lock size={16} className="text-info me-2 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    className="bg-transparent border-0 text-white w-100 shadow-none"
                    placeholder="At least 6 characters"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ color: '#ffffff' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn btn-sm text-secondary p-0"
                    style={{ color: '#cbd5e1' }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary-magnetic btn-magnetic w-100 py-2.5 rounded-pill mb-3 d-flex align-items-center justify-content-center gap-2 fw-semibold"
              >
                {loading ? 'Creating Account...' : 'Complete Registration'} <ArrowRight size={16} />
              </button>
            </form>

            <div className="text-center mt-3">
              <span className="small" style={{ color: '#94a3b8' }}>Already have an account? </span>
              <Link to="/login" className="text-info text-decoration-none small fw-bold">
                Sign in here
              </Link>
            </div>
          </MagneticCard>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
