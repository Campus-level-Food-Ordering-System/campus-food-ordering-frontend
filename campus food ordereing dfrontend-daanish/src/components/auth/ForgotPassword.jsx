import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';
import AuthLayout from './AuthLayout';
import '../../styles/authcss/SignIn.css';
// import '../../styles/authcss/ForgotPassword.css';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
    }, 1500);
  };

  const handleVerify = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // FLOW CORRECTED: Go to Change Password
      navigate('/change-password', { state: { email } });
    }, 1500);
  };

  return (
    <AuthLayout showBranding={false}>
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
            <input 
              type="text" 
              placeholder="1234" 
              maxLength="4"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required className="form-input code-input"
            />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}