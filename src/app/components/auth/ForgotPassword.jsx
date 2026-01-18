import '../../../styles/ForgotPassword.css';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
export default function ForgotPassword({ onNavigateToSignIn, onVerifySuccess }) {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSendCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate sending code
    setTimeout(() => {
      setIsLoading(false);
      setCodeSent(true);
      console.log('Verification code sent to:', email);
    }, 1500);
  };
  const handleVerifyCode = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate verification
    setTimeout(() => {
      setIsLoading(false);
      console.log('Code verified:', verificationCode);
      onVerifySuccess();
    }, 1500);
  };
  return (<AuthLayout showBranding={false}>
    <div className="forgot-password-header">
      <h2 className="forgot-password-title">Forgot Password? 🔑</h2>
      <p className="forgot-password-subtitle">
        {codeSent ? 'Enter the verification code sent to your email' : 'Enter your email to receive a verification code'}
      </p>
    </div>

    {!codeSent ? (<form onSubmit={handleSendCode} className="forgot-password-form">
      <div className="form-group-1">
        <label className="form-label">Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="student@skct.edu.in" required />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Sending Code...' : 'Send Code'}
      </button>
    </form>) : (<form onSubmit={handleVerifyCode} className="forgot-password-form">
      <div className="form-group-1">
        <div className="verification-sent-info">
          Verification code sent to <strong>{email}</strong>
        </div>
        <label className="form-label">Verification Code</label>
        <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="verification-code-input" placeholder="- - - -" maxLength={4} required />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Verifying...' : 'Verify Email'}
      </button>
    </form>)}

    <div className="back-to-signin">
      Remember your password?{' '}
      <button onClick={onNavigateToSignIn} className="signin-link">
        Sign In
      </button>
    </div>


  </AuthLayout>);
}
