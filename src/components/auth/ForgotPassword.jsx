import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import authService from '../../services/authService';
import '../../styles/authcss/SignIn.css';
import '../../styles/authcss/ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authService.forgotPassword({ email });
      setCodeSent(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to send reset code. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
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
    // verification is done in ChangePassword along with the new password
    navigate('/change-password', { state: { email, resetCode: code } });
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => navigate('/signin')} className="back_btn">
        <ArrowLeft size={12} /> Back
      </button>

      <div className="auth_header">
        <h2>Forgot Password? 🔑</h2>
        <p>{codeSent ? 'Enter the code sent to your email' : 'Enter your email to receive a reset code'}</p>
      </div>

      {error && <div className="error_banner" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

      {!codeSent ? (
        <form onSubmit={handleSendCode} className="auth_form">
          <div className="form_group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="student@skct.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="form_input"
            />
          </div>
          <button type="submit" className="submit_btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="auth_form">
          <div className="success_banner">Code sent to <b>{email}</b></div>
          <div className="form_group">
            <label>Verification Code</label>
            <div className="otp_input_group_forgot">
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
                  className="otp_box_forgot"
                  required
                />
              ))}
            </div>
          </div>
          <button type="submit" className="submit_btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
    </>
  );
}
