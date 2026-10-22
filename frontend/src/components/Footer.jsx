import React from 'react';
import { Compass, Github, Linkedin, Globe, Cpu, Database, Shield, CheckCircle2, Heart, ExternalLink, Code } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass-panel border-top border-secondary border-opacity-15 py-5 mt-auto">
      <div className="container">
        {/* Main Footer Row */}
        <div className="row g-4 mb-5">
          {/* Brand & Mission */}
          <div className="col-lg-5 col-md-12 text-center text-lg-start">
            <div className="d-flex align-items-center justify-content-center justify-content-lg-start gap-2 mb-3">
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 14px rgba(99, 102, 241, 0.45)'
                }}
              >
                <Compass size={20} color="#ffffff" />
              </div>
              <span className="fw-bold fs-4 text-white font-monospace">
                Seek<span style={{ color: '#38bdf8' }}>er</span>
              </span>
            </div>
            <p className="text-secondary small mb-3 leading-relaxed" style={{ maxWidth: 440, color: '#cbd5e1' }}>
              The high-velocity tech career platform engineered for top software engineers, product designers, and AI builders. Built with stateless JWT authentication, real-time application pipelines, and verified compensation standards.
            </p>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-lg-start">
              <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-dark border border-secondary border-opacity-30 small text-light font-monospace" style={{ fontSize: '0.78rem' }}>
                <Cpu size={13} className="text-primary" /> React 18 + Vite
              </span>
              <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-dark border border-secondary border-opacity-30 small text-light font-monospace" style={{ fontSize: '0.78rem' }}>
                <Database size={13} className="text-success" /> MongoDB / Mongoose
              </span>
              <span className="d-inline-flex align-items-center gap-1.5 px-3 py-1 rounded-pill bg-dark border border-secondary border-opacity-30 small text-light font-monospace" style={{ fontSize: '0.78rem' }}>
                <Shield size={13} className="text-info" /> JWT + bcryptjs
              </span>
            </div>
          </div>

          {/* About Developer Section */}
          <div className="col-lg-7 col-md-12">
            <div className="p-4 rounded-3" style={{ background: 'rgba(15, 20, 30, 0.75)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-3 mb-3 pb-3 border-bottom border-secondary border-opacity-20">
                <div>
                  <span className="badge bg-primary bg-opacity-25 text-info mb-1" style={{ fontSize: '0.72rem', letterSpacing: '0.05em' }}>
                    ENGINEER PROFILE
                  </span>
                  <h5 className="text-white fw-bold mb-0">About the Developer</h5>
                  <div className="text-secondary small mt-0.5" style={{ color: '#94a3b8' }}>
                    Created & Designed by <strong className="text-white">Diwakar Jha</strong>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-30 px-2.5 py-1.5 small d-flex align-items-center gap-1">
                    <span className="pulse-dot"></span> Available for Opportunities
                  </span>
                </div>
              </div>

              <p className="text-secondary small mb-3" style={{ color: '#cbd5e1' }}>
                Full Stack Developer specialized in building scalable modern web applications, distributed APIs, and polished interactive UI experiences. Connect with Diwakar across the developer web:
              </p>

              {/* Developer Links */}
              <div className="d-flex flex-wrap gap-2">
                <a
                  href="https://github.com/Stfu-diwakar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-pill"
                >
                  <Github size={16} className="text-white" />
                  <span>GitHub Profile</span>
                  <ExternalLink size={12} className="opacity-60 ms-1" />
                </a>

                <a
                  href="https://www.linkedin.com/in/diwakar-jha-064130229/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-pill"
                >
                  <Linkedin size={16} className="text-info" />
                  <span>LinkedIn Connect</span>
                  <ExternalLink size={12} className="opacity-60 ms-1" />
                </a>

                <a
                  href="https://portfolio-bpd3.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="creator-pill"
                >
                  <Globe size={16} className="text-success" />
                  <span>Interactive Portfolio</span>
                  <ExternalLink size={12} className="opacity-60 ms-1" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-secondary border-opacity-15 my-4" />

        {/* Copyright and Status */}
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center text-secondary small gap-2" style={{ color: '#94a3b8' }}>
          <div>
            &copy; {new Date().getFullYear()} <strong className="text-white">Seeker</strong> by Diwakar Jha. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            <span>Built with precision, high-contrast engineering, and zero fluff.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
