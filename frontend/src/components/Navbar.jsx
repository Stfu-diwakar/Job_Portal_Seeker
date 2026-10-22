import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Compass, User, LogOut, PlusCircle, Search, Menu, X, Shield } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        {/* Brand Logo: Seeker */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(99, 102, 241, 0.45)'
            }}
          >
            <Compass size={22} color="#ffffff" />
          </div>
          <span className="fw-bold fs-4 text-white font-monospace tracking-tight">
            Seek<span style={{ color: '#38bdf8' }}>er</span>
          </span>
          <span
            className="badge ms-1"
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              background: 'rgba(99, 102, 241, 0.18)',
              color: '#c7d2fe',
              border: '1px solid rgba(99, 102, 241, 0.4)'
            }}
          >
            JWT SECURE
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Navigation Links */}
        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item">
              <Link
                to="/"
                className={`nav-link px-3 ${isActive('/') ? 'text-white fw-bold' : 'text-secondary fw-semibold'}`}
                style={{ color: isActive('/') ? '#ffffff' : '#cbd5e1' }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/jobs"
                className={`nav-link px-3 d-flex align-items-center gap-1.5 ${isActive('/jobs') ? 'text-white fw-bold' : 'text-secondary fw-semibold'}`}
                style={{ color: isActive('/jobs') ? '#ffffff' : '#cbd5e1' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <Search size={16} />
                Browse Jobs
              </Link>
            </li>
            {isAuthenticated && (
              <li className="nav-item">
                <Link
                  to="/dashboard"
                  className={`nav-link px-3 ${isActive('/dashboard') ? 'text-white fw-bold' : 'text-secondary fw-semibold'}`}
                  style={{ color: isActive('/dashboard') ? '#ffffff' : '#cbd5e1' }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
            )}
            <li className="nav-item">
              <Link
                to="/post-job"
                className={`nav-link px-3 d-flex align-items-center gap-1.5 ${isActive('/post-job') ? 'text-white fw-bold' : 'text-secondary fw-semibold'}`}
                style={{ color: isActive('/post-job') ? '#ffffff' : '#cbd5e1' }}
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusCircle size={16} />
                Post a Job
              </Link>
            </li>
          </ul>

          {/* Right Auth Section */}
          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <div className="d-flex align-items-center gap-3">
                <Link to="/dashboard" className="d-flex align-items-center gap-2 text-decoration-none">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(99, 102, 241, 0.25)',
                      border: '1px solid rgba(99, 102, 241, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#c7d2fe'
                    }}
                  >
                    <User size={18} />
                  </div>
                  <div className="d-none d-sm-block text-start">
                    <div className="text-white fw-bold" style={{ fontSize: '0.88rem' }}>
                      {user?.name || 'User'}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 600 }}>
                      {user?.role === 'recruiter' ? 'Recruiter' : 'Software Engineer'}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3 py-1.5 fw-semibold"
                  title="Logout"
                >
                  <LogOut size={14} />
                  <span className="d-none d-sm-inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="btn btn-outline-light rounded-pill px-4 py-2 fw-semibold" style={{ fontSize: '0.9rem' }}>
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary-magnetic btn-magnetic rounded-pill px-4 py-2" style={{ fontSize: '0.9rem' }}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
