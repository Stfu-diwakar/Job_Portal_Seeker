import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle, ArrowRight, Sparkles, Compass } from 'lucide-react';
import MagneticCard from '../components/MagneticCard';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('All Fields Required');
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err?.response?.data?.message || 'Something Went Wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8">
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
                SEEKER PORTAL
              </span>
              <h2 className="text-white fw-bold mb-1">Welcome Back</h2>
              <p className="small" style={{ color: '#cbd5e1' }}>Authenticate with your credentials to access your dashboard.</p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2 mb-3">
                <AlertCircle size={16} /> {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-semibold" style={{ color: '#cbd5e1' }}>Email Address</label>
                <div className="d-flex align-items-center filter-input">
                  <Mail size={16} className="text-info me-2 flex-shrink-0" />
                  <input
                    type="email"
                    className="bg-transparent border-0 text-white w-100 shadow-none"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ color: '#ffffff' }}
                  />
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <label className="form-label small fw-semibold mb-0" style={{ color: '#cbd5e1' }}>Password</label>
                </div>
                <div className="d-flex align-items-center filter-input">
                  <Lock size={16} className="text-info me-2 flex-shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="bg-transparent border-0 text-white w-100 shadow-none"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight size={16} />
              </button>
            </form>

            {/* Demo Accounts Quick-Fill Section */}
            <div className="mt-4 pt-3 border-top border-secondary border-opacity-20">
              <div className="d-flex align-items-center gap-1.5 small mb-2 fw-semibold" style={{ color: '#cbd5e1' }}>
                <Sparkles size={14} className="text-warning" />
                <span>Instant Demo Accounts:</span>
              </div>
              <div className="d-flex gap-2">
                <button
                  type="button"
                  onClick={() => handleDemoFill('alex@example.com', 'password123')}
                  className="btn btn-sm btn-outline-info rounded-pill flex-grow-1 fw-semibold py-1.5"
                  style={{ fontSize: '0.8rem' }}
                >
                  Jobseeker Demo
                </button>
                <button
                  type="button"
                  onClick={() => handleDemoFill('recruiter@techjobs.io', 'password123')}
                  className="btn btn-sm btn-outline-secondary rounded-pill flex-grow-1 fw-semibold py-1.5"
                  style={{ fontSize: '0.8rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  Recruiter Demo
                </button>
              </div>
            </div>

            {/* Registration Footer */}
            <div className="text-center mt-4">
              <span className="small" style={{ color: '#94a3b8' }}>Don't have an account? </span>
              <Link to="/register" className="text-info text-decoration-none small fw-bold">
                Register here
              </Link>
            </div>
          </MagneticCard>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
