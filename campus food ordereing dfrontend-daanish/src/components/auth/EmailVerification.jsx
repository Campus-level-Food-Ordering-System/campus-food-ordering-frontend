import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import '../../styles/authcss/EmailVerification.css'; // Specific styles for this page

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'rakshay7721@gmail.com'; // Default for demo
  
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Verification
    setTimeout(() => {
      setIsLoading(false);
      // FLOW CORRECTED: Go to College Verification next
      navigate('/college-verification'); 
    }, 1500);
  };

  return (
    <AuthLayout showBranding={false}>
      <div className="verify-container">
        {/* Mail Icon */}
        <div className="mail-icon-wrapper">
          <div className="mail-icon">@</div>
        </div>

        <h2 className="verify-title">Verify Your Email</h2>
        <p className="verify-text">
          We've sent a verification code to <br></br><span className="email-highlight">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="verify-form">
            <label className="verify-label">Enter Verification Code</label>
          <div className="verify-input-group">
            <input 
              type="text" 
              placeholder="------" 
              maxLength="6"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="verify-input"
              required
            />
          </div>
          
          <button type="submit" className="verify-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        
        <div className="verify-footer">
          Didn't receive code? <button className="resend-link">Resend</button>
        </div>
      </div>
    </AuthLayout>
  );
}