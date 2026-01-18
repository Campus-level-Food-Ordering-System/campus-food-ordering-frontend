import '../../../styles/CollegeVerification.css';
import { useState } from 'react';
import AuthLayout from './AuthLayout';
export default function CollegeVerification({ onCompleteProfile }) {
  const [collegeName, setCollegeName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      console.log('College verification:', { collegeName, department, year });
      onCompleteProfile();
    }, 1500);
  };
  return (<AuthLayout showBranding={false}>
    <div className="college-verification-header">
      <div className="college-icon">🎓</div>
      <h2 className="college-title">College Verification</h2>
      <p className="college-subtitle">
        Complete your profile to get started
      </p>
    </div>

    <form onSubmit={handleSubmit} className="college-form">
      <div className="form-group-1">
        <label className="form-label">College Name</label>
        <select value={collegeName} onChange={(e) => setCollegeName(e.target.value)} className="form-select" required>
          <option value="">Select College</option>
          <option value="SKCT">SKCT</option>
          <option value="SKASC">SKASC</option>
        </select>
      </div>

      <div className="form-group-2">
        <label className="form-label">Department</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)} className="form-select" required>
          <option value="">Select Department</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Electrical">Electrical</option>
          <option value="Mechanics">Mechanics</option>
          <option value="Electronics & Communication">Electronics & Communication</option>
          <option value="Civil">Civil</option>
          <option value="Information Technology">Information Technology</option>
          <option value="AI & Data Science">AI & Data Science</option>
        </select>
      </div>

      <div className="form-group-3">
        <label className="form-label">Year of Study</label>
        <select value={year} onChange={(e) => setYear(e.target.value)} className="form-select" required>
          <option value="">Select Year</option>
          <option value="1st Year">1st Year</option>
          <option value="2nd Year">2nd Year</option>
          <option value="3rd Year">3rd Year</option>
          <option value="4th Year">4th Year</option>
        </select>
      </div>

      <button type="submit" disabled={isLoading} className="submit-button">
        {isLoading ? 'Completing Profile...' : 'Complete Profile'}
      </button>
    </form>


  </AuthLayout>);
}
