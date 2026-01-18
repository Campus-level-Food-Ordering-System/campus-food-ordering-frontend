import '../../../styles/EmailVerification.css';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
export default function EmailVerification({ userEmail, onVerifySuccess }) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Email verified with code:', verificationCode);
      onVerifySuccess();
    }, 1500);
  };
  const handleResendCode = () => {
    console.log('Resending verification code to:', userEmail);
    // Add toast notification here
  };
  return (<AuthLayout showBranding={false}>
    <div className="email-verification-header">
      <div className="email-icon">📧</div>
      <h2 className="email-title">Verify Your Email</h2>
      <p className="email-subtitle">
        We've sent a verification code to
      </p>
      <p className="user-email-text">{userEmail}</p>
    </div>

    <form onSubmit={handleSubmit} className="email-form">
      <div className="form-group-1">
        <label className="form-label-center">Enter Verification Code</label>
        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="verification-input" placeholder="- - - -" maxLength={4} required />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Verifying...' : 'Verify'}
      </button>
    </form>

    <div className="resend-section">
      Didn't receive the code?{' '}
      <button onClick={handleResendCode} className="resend-button">
        Resend
      </button>
    </div>


  </AuthLayout>);
}
