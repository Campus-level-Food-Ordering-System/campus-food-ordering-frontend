import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext'; // Import Auth
import AuthLayout from './AuthLayout';
import CustomDropdown from '../common/CustomDropdown';
import '../../styles/authcss/SignIn.css';

export default function CollegeVerification() {
  const navigate = useNavigate();
  const { login } = useAuth(); // We need to log them in now
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    college: '',
    department: '',
    year: ''
  });

  const handleCollegeChange = (value) => {
    // reset dependent fields when college changes
    setFormData({
      college: value,
      department: '',
      year: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.college || !formData.department || !formData.year) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // FLOW CORRECTED: Now we log the user in and go to Dashboard
      login({
        email: 'student@skct.edu.in',
        role: 'student',
        ...formData
      });
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const collegeOptions = [
    { value: 'SKCT', label: 'SKCT' },
    { value: 'SKASC', label: 'SKASC' }
  ];

  const departmentOptions =
    formData.college === 'SKCT'
      ? [
        { value: 'CSE', label: 'Computer Science (CSE)' },
        { value: 'IT', label: 'Information Technology (IT)' },
        { value: 'ECE', label: 'Electronics (ECE)' },
        { value: 'MECH', label: 'Mechanical (MECH)' }
      ]
      : formData.college === 'SKASC'
        ? [
          { value: 'COMMERCE', label: 'Commerce Stream' },
          { value: 'COMPUTER', label: 'Computer Stream' },
          { value: 'MANAGEMENT', label: 'Management' },
          { value: 'ARTS_SCIENCE', label: 'Arts and Science' }
        ]
        : [];

  const yearOptions =
    formData.college === 'SKCT'
      ? [
        { value: '1', label: '1st Year' },
        { value: '2', label: '2nd Year' },
        { value: '3', label: '3rd Year' },
        { value: '4', label: '4th Year' }
      ]
      : formData.college === 'SKASC'
        ? [
          { value: '1', label: '1st Year' },
          { value: '2', label: '2nd Year' },
          { value: '3', label: '3rd Year' }
        ]
        : [];

  return (
    <AuthLayout>
      <div className="auth-header" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎓</div>
        <h2>College Profile</h2>
        <p>Complete your academic details</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label><Building2 size={16} /> College Name</label>
          <CustomDropdown
            placeholder="Select College"
            options={collegeOptions}
            value={formData.college}
            onChange={handleCollegeChange}
          />
        </div>

        <div className="form-group">
          <label><GraduationCap size={16} /> Department</label>
          <CustomDropdown
            placeholder="Select Department"
            options={departmentOptions}
            value={formData.department}
            onChange={(val) => setFormData({ ...formData, department: val })}
            disabled={!formData.college}
          />
        </div>

        <div className="form-group">
          <label><Calendar size={16} /> Year of Study</label>
          <CustomDropdown
            placeholder="Select Year"
            options={yearOptions}
            value={formData.year}
            onChange={(val) => setFormData({ ...formData, year: val })}
            disabled={!formData.college}
          />
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Complete Profile'}
        </button>
      </form>
    </AuthLayout>
  );
}