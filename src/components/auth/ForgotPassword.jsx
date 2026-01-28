import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import AuthLayout from './AuthLayout';
import '../../styles/authcss/SignIn.css';
import '../../styles/authcss/ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  const handleSendCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
    }, 1500);
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
    setTimeout(() => {
      setIsLoading(false);
      navigate('/change-password', { state: { email } });
    }, 1500);
  };

  return (
    <AuthLayout>
      <button onClick={() => navigate('/signin')} className="back-btn">
        <ArrowLeft size={12} /> Back
      </button>

      <div className="auth-header">
        <h2>Forgot Password? 🔑</h2>
        <p>{codeSent ? 'Enter the code sent to your email' : 'Enter your email to receive a reset code'}</p>
      </div>

      {!codeSent ? (
        <form onSubmit={handleSendCode} className="auth-form">
          <div className="form-group">
            <label><Mail size={16} /> Email Address</label>
            <input
              type="email"
              placeholder="student@skct.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required className="form-input"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="auth-form">
          <div className="success-banner">Code sent to <b>{email}</b></div>
          <div className="form-group">
            <label><KeyRound size={16} /> Verification Code</label>
            <div className="otp-input-group-forgot">
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
                  className="otp-box-forgot"
                  required
                />
              ))}
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}