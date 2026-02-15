import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';
import AuthLayout from './AuthLayout';
import '../../styles/authcss/SignIn.css';

export default function ChangePassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords don't match");
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // FLOW CORRECTED: Back to Sign In to login with new password
      navigate('/signin');
    }, 1500);
  };

  return (
    <AuthLayout showBranding={false}>
      <div className="auth-header">
        <h2>Reset Password 🔒</h2>
        <p>Create a strong new password</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label><Lock size={16} /> New Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required className="form-input"
          />
        </div>
        <div className="form-group">
          <label><Lock size={16} /> Confirm Password</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required className="form-input"
          />
        </div>
        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </AuthLayout>
  );
}