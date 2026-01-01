import '../../../styles/ChangePassword.css';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
export default function ChangePassword({ onChangePasswordSuccess, userEmail }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('Password changed successfully');
      onChangePasswordSuccess();
    }, 1500);
  };
  return (<AuthLayout showBranding={false}>
    <div className="change-password-header">
      <h2 className="change-password-title">Change Password 🔒</h2>
      <p className="change-password-subtitle">Enter your new password</p>
    </div>

    {error && (<div className="error-message">
      {error}
    </div>)}

    {userEmail && (<div className="user-email-info">
      Changing password for <strong>{userEmail}</strong>
    </div>)}

    <form onSubmit={handleSubmit} className="change-password-form">
      <div className="form-group-1">
        <label className="form-label">New Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required minLength={8} />
      </div>

      <div className="form-group-2">
        <label className="form-label">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="••••••••" required minLength={8} />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Changing Password...' : 'Change Password'}
      </button>
    </form>


  </AuthLayout>);
}
