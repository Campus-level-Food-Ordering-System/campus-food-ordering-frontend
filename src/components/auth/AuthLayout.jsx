import { Zap, GraduationCap, Rocket, CreditCard } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import '../../styles/authcss/AuthLayout.css';

export default function AuthLayout({ children, showBranding = true }) {
  return (
    <div className="auth_container">
      {/* Background Animated Orbs */}
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="auth_content_wrapper">
        <div className={`auth_card ${showBranding ? 'with_branding' : ''}`}>

          {/* Left Side: Branding (Hidden on mobile) */}
          {showBranding && (
            <div className="branding_section">
              <div className="branding_orb"></div>

              <div className="brand_content">
                <div className="brand_emoji">🍕</div>
                <h1 className="brand_title">CampusEats</h1>
                <p className="brand_subtitle">Delicious food delivered to your dorm</p>

                <div className="feature_list">
                  <div className="feature_item">
                    <span className="feature_icon"><Zap size={18} fill="currentColor" /></span> Quick & Easy Ordering
                  </div>
                  <div className="feature_item">
                    <span className="feature_icon"><GraduationCap size={18} fill="currentColor" /></span> Exclusive Campus Deals
                  </div>
                  <div className="feature_item">
                    <span className="feature_icon"><Rocket size={18} fill="currentColor" /></span> Fast Delivery
                  </div>
                  <div className="feature_item">
                    <span className="feature_icon"><CreditCard size={18} fill="currentColor" /></span> Secure Payment
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Right Side: Form */}
          <div className="form_section">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
