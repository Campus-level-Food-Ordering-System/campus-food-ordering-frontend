import React from 'react';
import '../../styles/authcss/AuthLayout.css';

export default function AuthLayout({ children, showBranding = true }) {
  return (
    <div className="auth-container">
      {/* Background Animated Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="auth-content-wrapper">
        <div className={`auth-card ${showBranding ? 'with-branding' : ''}`}>
          
          {/* Left Side: Branding (Hidden on mobile) */}
          {showBranding && (
            <div className="branding-section">
              <div className="branding-orb"></div>
              
              <div className="brand-content">
                <div className="brand-emoji">🍕</div>
                <h1 className="brand-title">CampusEats</h1>
                <p className="brand-subtitle">Delicious food delivered to your dorm</p>
                
                <div className="feature-list">
                  <div className="feature-item">
                    <span className="feature-icon">🚀</span> Quick & Easy Ordering
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🔥</span> Exclusive Campus Deals
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">🛵</span> Fast Delivery
                  </div>
                  <div className="feature-item">
                    <span className="feature-icon">💳</span> Secure Payment
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Right Side: Form */}
          <div className="form-section">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}