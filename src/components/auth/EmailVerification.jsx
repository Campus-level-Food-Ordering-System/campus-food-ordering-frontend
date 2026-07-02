import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../../services/authService';
import '../../styles/authcss/EmailVerification.css';

export default function EmailVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'rakshay7721@gmail.com';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendMsg, setResendMsg] = useState('');
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

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    setError('');

    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);

    try {
      await authService.verifyEmail({ email, code });
      navigate('/signin');
    } catch (err) {
      console.error('Verification error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setResendMsg('');
    try {
      await authService.resendVerificationCode({ email });
      setResendMsg('Verification code resent successfully.');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to resend code. Please try again.');
      }
    }
  };

  return (
    <>
      <div className="verify_container">
        <div className="mail_icon_wrapper">
          <div className="mail_icon">@</div>
        </div>

        <h2 className="verify_title">Verify Your Email</h2>
        <p className="verify_text">
          We've sent a verification code to<br />
          <span className="email_highlight">{email}</span>
        </p>

        {error && <div className="error_banner" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
        {resendMsg && <div className="success_banner" style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{resendMsg}</div>}

        <form onSubmit={handleVerify} className="verify_form">
          <label className="verify_label">Enter Verification Code</label>
          <div className="otp_input_group">
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
                className="otp_box"
                required
              />
            ))}
          </div>

          <button type="submit" className="verify_btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <div className="verify_footer">
          Didn't receive code? <button type="button" className="resend_link" onClick={handleResend}>Resend</button>
        </div>
      </div>
    </>
  );
}
