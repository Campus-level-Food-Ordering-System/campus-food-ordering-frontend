import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/authcss/SignIn.css';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    // Simulate API Call for Standard Sign Up
    setTimeout(() => {
      setIsLoading(false);
      // NOTE: We do NOT login yet. We send them to verify email first.
      navigate('/email-verification', { state: { email } });
    }, 1500);
  };

  const handleGoogleSignUp = () => {
    // Simulate Google Auth
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Google users are already verified, so go straight to College Profile
      navigate('/college-verification', { state: { email: 'google-user@example.com' } });
    }, 1000);
  };

  return (
    <>
      <div className="auth_header">
        <h2>Create Account 🎉</h2>
        <p>Join CampusEats today!</p>
      </div>

      {error && <div className="error_banner">{error}</div>}

      <form onSubmit={handleSubmit} className="auth_form">
        <div className="form_group animate_fade_in_1">
          <label>Username</label>
          <input
            type="text"
            placeholder="johndoe123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required className="form_input"
          />
        </div>

        <div className="form_group animate_fade_in_2">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="student@skct.edu.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required className="form_input"
          />
        </div>

        <div className="form_group animate_fade_in_3">
          
          <label>Password</label>
          <div className="password_input_wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form_input password_input"
          />
          <button
            type="button"
            className="password_toggle_btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1" // Prevents tab key from focusing the eye icon
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
        </div>

        <div className="form_group animate_fade_in_4">
          <label>Confirm Password</label>
          <div className="password_input_wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required className="form_input password_input"
          />
          <button
            type="button"
            className="password_toggle_btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex="-1" // Prevents tab key from focusing the eye icon
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          </div>
        </div>

        <button type="submit" className="submit_btn" disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>

      <div className="divider">
        <div className="line"></div>
        <span>OR</span>
        <div className="line"></div>
      </div>

      <button className="google_btn" onClick={handleGoogleSignUp} type="button">
        <svg className="google_icon" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12 5.04c1.9 0 3.51.64 4.79 1.76l3.54-3.54C18.18 1.39 15.35 0 12 0 7.35 0 3.39 2.67 1.45 6.57l4.15 3.22c.96-2.73 3.54-4.75 6.4-4.75z" />
          <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.37H12v4.49h6.44c-.28 1.51-1.12 2.78-2.4 3.64l3.8 2.94c2.22-2.05 3.65-5.06 3.65-8.7z" />
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.8-2.94c-1.08.72-2.47 1.15-4.13 1.15-3.19 0-5.89-2.15-6.85-5.05L1.08 17.5C3.01 21.33 6.95 24 12 24z" />
          <path fill="#FBBC05" d="M5.15 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25l-4.15-3.22C.41 8.09 0 10.01 0 12c0 1.99.41 3.91 1 5.43l4.15-3.18z" />
        </svg>
        Continue with Google
      </button>

      <div className="auth_footer">
        Already have an account? <button onClick={() => navigate('/signin')} className="link_btn">Sign In</button>
      </div>
    </>
  );
}
