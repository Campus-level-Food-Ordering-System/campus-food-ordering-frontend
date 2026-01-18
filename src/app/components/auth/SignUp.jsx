import '../../../styles/SignUp.css';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
import RoleSelector from './RoleSelector';
export default function SignUp({ onNavigateToSignIn, onSignUpSuccess, onGoogleSignUp, userRole, setUserRole }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
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
      console.log('Sign Up:', { username, email, password });
      onSignUpSuccess(email, false);
    }, 1500);
  };
  const handleGoogleSignUp = () => {
    console.log('Google Sign Up clicked');
    onGoogleSignUp();
  };
  return (<AuthLayout>

    <div className="signup-header">
      <h2 className="signup-title">Create Account 🎉</h2>
      <p className="signup-subtitle">Join CampusEats today!</p>
    </div>

    {error && (<div className="error-message">
      {error}
    </div>)}

    <div className="google-button-container">
      <button type="button" onClick={handleGoogleSignUp} className="google-signup-button">
        <svg className="google-icon" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        Continue with Google
      </button>
    </div>

    <div className="divider-container">
      <div className="divider-line"></div>
      <span className="divider-text">OR</span>
      <div className="divider-line"></div>
    </div>

    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group-1">
        <label className="form-label">Username</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="form-input" placeholder="Profile Name" required minLength={3} />
      </div>

      <div className="form-group-2">
        <label className="form-label">Email Address</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-input" placeholder="student@gmail.com" required />
      </div>

      <div className="form-group-3">
        <label className="form-label">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" placeholder="••••••••" required minLength={8} />
      </div>

      <div className="form-group-4">
        <label className="form-label">Confirm Password</label>
        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="form-input" placeholder="••••••••" required minLength={8} />
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
    </form>

    <div className="signin-prompt">
      Already have an account?{' '}
      <button onClick={onNavigateToSignIn} className="signin-link">
        Sign In
      </button>
    </div>


  </AuthLayout>);
}
