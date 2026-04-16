import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const AuthenticationLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <div className="auth-layout">
      <header className="auth-layout-header">
        <div className="auth-layout-header-content">
          <div className="auth-layout-logo">
            <div className="auth-layout-logo-icon">
              <Icon name="Dribbble" size={24} color="white" />
            </div>
            <span className="auth-layout-logo-text">FutsalBooker</span>
          </div>
        </div>
      </header>

      <main className="auth-layout-main">
        <div className="auth-layout-container">
          <div className="auth-layout-card">
            {children}
          </div>
        </div>
      </main>

      <footer className="auth-layout-footer">
        <div className="auth-layout-footer-content">
          <p>© 2025 FutsalBooker. Secure booking platform for sports facilities.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthenticationLayout;