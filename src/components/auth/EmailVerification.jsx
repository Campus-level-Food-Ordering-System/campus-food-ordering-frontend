import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout';
import '../../styles/authcss/EmailVerification.css';

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'rakshay7721@gmail.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];

    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }

    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const code = otp.join('');

    if (code.length !== 6) {
      alert('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate('/college-verification');
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="verify-container">
        <div className="mail-icon-wrapper">
          <div className="mail-icon">@</div>
        </div>

        <h2 className="verify-title">Verify Your Email</h2>
        <p className="verify-text">
          We've sent a verification code to<br />
          <span className="email-highlight">{email}</span>
        </p>

        <form onSubmit={handleVerify} className="verify-form">
          <label className="verify-label">Enter Verification Code</label>
          <div className="otp-input-group">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="otp-box"
                required
              />
            ))}
          </div>

          <button type="submit" className="verify-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="verify-footer">
          Didn't receive code? <button type="button" className="resend-link">Resend</button>
        </div>
      </div>
    </AuthLayout>
  );
}