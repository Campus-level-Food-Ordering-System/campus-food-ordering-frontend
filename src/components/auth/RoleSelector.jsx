import React from 'react';
import '../../styles/authcss/RoleSelector.css';

export default function RoleSelector({ userRole, setUserRole }) {
  return (
    <div className="role_selector_container">
      <button
        className={`role-toggle-btn ${userRole === 'student' ? 'active' : ''}`}
        onClick={() => setUserRole('student')}
      >
        👨‍🎓 Student
      </button>
      <button
        className={`role-toggle-btn ${userRole === 'admin' ? 'active' : ''}`}
        onClick={() => setUserRole('admin')}
      >
        🔐 Admin
      </button>
    </div>
  );
}
