import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/authService';
import CustomDropdown from '../common/CustomDropdown';
import '../../styles/authcss/SignIn.css';

export default function SignUp() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');

  const collegeOptions = [
    { value: 'SKCT', label: 'SKCT' },
    { value: 'SKASC', label: 'SKASC' }
  ];

  const departmentOptions =
    collegeName === 'SKCT'
      ? [
        { value: 'CSE', label: 'Computer Science (CSE)' },
        { value: 'IT', label: 'Information Technology (IT)' },
        { value: 'ECE', label: 'Electronics (ECE)' },
        { value: 'MECH', label: 'Mechanical (MECH)' }
      ]
      : collegeName === 'SKASC'
        ? [
          { value: 'COMMERCE', label: 'Commerce Stream' },
          { value: 'COMPUTER', label: 'Computer Stream' },
          { value: 'MANAGEMENT', label: 'Management' },
          { value: 'ARTS_SCIENCE', label: 'Arts and Science' }
        ]
        : [];

  const yearOptions =
    collegeName === 'SKCT'
      ? [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' }
      ]
      : collegeName === 'SKASC'
        ? [
          { value: '1', label: '1st Year' },
          { value: '2', label: '2nd Year' },
          { value: '3', label: '3rd Year' }
        ]
        : [];

  const handleCollegeChange = (val) => {
    setCollegeName(val);
    setDepartment('');
    setYearOfStudy('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!collegeName || !department || !yearOfStudy) {
      setError('Please select your college details');
      return;
    }

    setIsLoading(true);

    try {
      await authService.signup({
        username,
        email,
        password,
        role: 'USER',
        authType: 'PASSWORD',
        collegeName,
        department,
        yearOfStudy
      });
      navigate('/email-verification', { state: { email } });
    } catch (err) {
      console.error('Signup error:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Google Auth handled externally or later
    setError('Google Sign Up is temporarily disabled.');
  };

  return (
    <>
      <div className="auth_header">
        <h2>Create Account 🎉</h2>
        <p>Join CampusEats today!</p>
      </div>

      {error && <div className="error_banner" style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

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

        <div className="form_group animate_fade_in_3" style={{ zIndex: 10 }}>
          <label>College Name</label>
          <CustomDropdown
            placeholder="Select College"
            options={collegeOptions}
            value={collegeName}
            onChange={handleCollegeChange}
          />
        </div>

        <div className="form_group animate_fade_in_3" style={{ zIndex: 9 }}>
          <label>Department</label>
          <CustomDropdown
            placeholder="Select Department"
            options={departmentOptions}
            value={department}
            onChange={(val) => setDepartment(val)}
            disabled={!collegeName}
          />
        </div>

        <div className="form_group animate_fade_in_3" style={{ zIndex: 8 }}>
          <label>Year of Study</label>
          <CustomDropdown
            placeholder="Select Year"
            options={yearOptions}
            value={yearOfStudy}
            onChange={(val) => setYearOfStudy(val)}
            disabled={!collegeName}
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
            tabIndex="-1"
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
            tabIndex="-1"
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

