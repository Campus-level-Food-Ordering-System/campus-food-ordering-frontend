import '../../../styles/AuthLayout.css';
export default function AuthLayout({ children, showBranding = true }) {
  return (<>
    {/* Background Decorations */}
    <div className="bg-decoration bg-decoration-1" />
    <div className="bg-decoration bg-decoration-2" />
    <div className="bg-decoration bg-decoration-3" />

    <div className="auth-layout-container">
      <div className="auth-wrapper">
        <div className={`auth-card ${showBranding ? 'with-branding' : ''}`}>
          {showBranding && (<div className="branding-section">
            <div className="branding-circle" />

            <div className="brand-icon">🍕</div>
            <div className="brand-title">
              CampusEats
            </div>
            <div className="brand-subtitle">
              Delicious food delivered to your dorm
            </div>

            <div className="features-list">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <span>Quick & Easy Ordering</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <span>Exclusive Campus Deals</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🚀</div>
                <span>Fast Delivery</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">💳</div>
                <span>Secure Payments</span>
              </div>
            </div>
          </div>)}

          <div className="content-section">
            {children}
          </div>
        </div>
      </div>
    </div>


  </>);
}
