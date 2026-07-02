import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock } from 'lucide-react';
import authService from '../../services/authService';
import '../../styles/authcss/SignIn.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const resetToken = location.state?.resetCode;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !resetToken) {
      setError('Missing reset token or email. Please restart the password reset process.');
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.resetPassword({ email, resetToken, newPassword: password });
      setSuccess(true);
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="auth_header">
        <h2>Reset Password 🔒</h2>
        <p>Create a strong new password</p>
      </div>

      {error && <div className="error_banner" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}
      {success && <div className="success_banner" style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>Password reset successfully. Redirecting...</div>}

      <form onSubmit={handleSubmit} className="auth_form">
        <div className="form_group">
          <label><Lock size={16} /> New Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required className="form_input"
          />
        </div>
        <div className="form_group">
          <label><Lock size={16} /> Confirm Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required className="form_input"
          />
        </div>
        <button type="submit" className="submit_btn" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </>
  );
}
