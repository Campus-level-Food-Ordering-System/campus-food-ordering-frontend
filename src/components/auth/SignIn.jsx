import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/authcss/SignIn.css';

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user  } = useAuth();

  const [userRole, setUserRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  React.useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, navigate]);

  // Detect admin route from URL to switch mode
  React.useEffect(() => {
    if (location.pathname.includes('/admin')) {
      setUserRole('admin');
    } else {
      setUserRole('student');
    }
  }, [location.pathname]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API Call
    setTimeout(() => {
      let userData = null;

      // 1. Check for Admin
      if (email === 'admin@gmail.com' && password === 'admin123') {
        userData = {
          email,
          role: 'admin',
          username: 'Super Admin'
        };
      }
      // 2. Check for Dynamic Vendors
      else {
        const vendorAccounts = JSON.parse(localStorage.getItem('vendor_accounts') || '{}');
        // Iterate over values since keys are now IDs
        const dynamicVendor = Object.values(vendorAccounts).find(acc => acc.email === email);

        if (dynamicVendor && dynamicVendor.password === password) {
          userData = {
            email,
            role: 'vendor',
            vendorId: dynamicVendor.vendorId || Object.keys(vendorAccounts).find(key => vendorAccounts[key] === dynamicVendor),
            vendorName: dynamicVendor.name || dynamicVendor.vendorName
          };
        }
        // 3. Check for Static Mock Vendor (Legacy)
        else if (email === 'ven@gmail.com') {
          userData = {
            email,
            role: 'vendor',
            vendorId: 1,
            vendorName: 'Main Block Chat Coffee'
          };
        }
        // 4. Default to Student (Simulated)
        else {
          userData = {
            id: Math.floor(Math.random() * 1000),
            username: email.split('@')[0],
            email,
            collegeName: 'SKCT',
            department: 'CSE',
            yearOfStudy: '3',
            role: 'student'
          };
        }
      }

      login(userData, rememberMe);
      setIsLoading(false);

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin');
      } else if (userData.role === 'vendor') {
        navigate('/vendor-dashboard');
      } else {
        navigate('/dashboard');
      }
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    // Simulate Google Auth -> Skip email verification -> Go to College Profile
    setTimeout(() => {
      login({
        id: 102,
        username: 'google_user',
        email: 'google-user@example.com',
        collegeName: 'SKCT',
        department: 'IT',
        yearOfStudy: '2',
        role: userRole,
        authMethod: 'google'
      }, rememberMe);
      setIsLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <>
      <div className="auth_header">
        <h2>{userRole === 'student' ? 'Welcome Back! 👋' : 'Admin Portal 🔐'}</h2>
        <p>{userRole === 'student' ? 'Sign in to your student account' : 'Access the admin dashboard'}</p>
      </div>

      <form onSubmit={handleSubmit} className="auth_form">
        <div className="form_group animate_fade_in-1">
          <label>{userRole === 'student' ? 'Email Address' : 'Admin Email'}</label>
          <input
            type="email"
            placeholder={userRole === 'student' ? 'student@skct.edu.in' : 'admin@campuseats.com'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form_input"
          />
        </div>

        <div className="form_group animate_fade_in-2">
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

          <div className="form_options">
            <label className="checkbox_label">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>Remember me</span>
            </label>
            {userRole === 'student' && (
              <button
                type="button"
                className="forgot_link"
                onClick={() => navigate('/forgot-password')}
              >
                Forgot Password?
              </button>
            )}
          </div>
        </div>

        <button type="submit" className="submit_btn" disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>

      {/* Google Sign In Section */}
      {userRole === 'student' && (
        <>
          <div className="divider">
            <div className="line"></div>
            <span>OR</span>
            <div className="line"></div>
          </div>

          <button type="button" className="google_btn" onClick={handleGoogleSignIn}>
            <svg className="google_icon" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5.04c1.9 0 3.51.64 4.79 1.76l3.54-3.54C18.18 1.39 15.35 0 12 0 7.35 0 3.39 2.67 1.45 6.57l4.15 3.22c.96-2.73 3.54-4.75 6.4-4.75z" />
              <path fill="#4285F4" d="M23.49 12.27c0-.82-.07-1.61-.21-2.37H12v4.49h6.44c-.28 1.51-1.12 2.78-2.4 3.64l3.8 2.94c2.22-2.05 3.65-5.06 3.65-8.7z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.8-2.94c-1.08.72-2.47 1.15-4.13 1.15-3.19 0-5.89-2.15-6.85-5.05L1.08 17.5C3.01 21.33 6.95 24 12 24z" />
              <path fill="#FBBC05" d="M5.15 14.25c-.24-.72-.38-1.49-.38-2.25s.14-1.53.38-2.25l-4.15-3.22C.41 8.09 0 10.01 0 12c0 1.99.41 3.91 1 5.43l4.15-3.18z" />
            </svg>
            Continue with Google
          </button>
        </>
      )}
      {userRole === 'student' && (
        <div className="auth_footer">
          Don't have an account? <button onClick={() => navigate('/signup')} className="link_btn">Sign Up</button>
        </div>
      )}
    </>
  );
}
