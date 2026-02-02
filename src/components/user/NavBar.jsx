import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/usercss/StudentNavBar.css';

export default function NavBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileSectionRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileSectionRef.current && !profileSectionRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileMenu]);

  return (
    <header className="student_navbar_container">
      <div className="student_navbar_content">
        <div className="student_logo_section" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="student_logo_emoji">🍕</div>
          <div className="student_logo_text">
            <h1>CampusEats</h1>
            <p>Order your favorite food</p>
          </div>
        </div>

        <div className="student_profile_section" ref={profileSectionRef}>
          <button
            className="student_profile_btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="student_profile_icon"><User size={20} /></div>
            <span className="student_profile_label">Profile</span>
            <ChevronDown size={16} className={`student_arrow ${showProfileMenu ? 'rotate' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="student_profile_dropdown">
              <div className="student_dropdown_header">
                <p className="student_user_role">{user?.role || 'Student'}</p>
                <p className="student_user_email">{user?.email || 'student@skct.edu.in'}</p>
              </div>
              <button className="student_dropdown_item">
                <Settings size={16} /> Settings
              </button>
              <button className="student_dropdown_item" onClick={() => navigate('/orders')}>
                <Package size={16} /> My Orders
              </button>
              <button className="student_dropdown_item logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
