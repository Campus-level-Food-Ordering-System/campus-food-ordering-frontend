import '../../../styles/RoleSelector.css';

export default function RoleSelector({ userRole, setUserRole }) {
  return (<div className="role-selector-container">
    <button onClick={() => setUserRole('student')} className={`role-button ${userRole === 'student' ? 'active' : 'inactive'}`}>
      👨‍🎓 Student Login
    </button>
    <button onClick={() => setUserRole('vendor')} className={`role-button ${userRole === 'vendor' ? 'active' : 'inactive'}`}>
      🏪 Vendor Login
    </button>
  </div>);
}
