import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/usercss/StudentNavBar.css';
import './Profile';

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
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="logo-section" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-emoji">🍕</div>
          <div className="logo-text">
            <h1>CampusEats</h1>
            <p>Order your favorite food</p>
          </div>
        </div>

        <div className="profile-section" ref={profileSectionRef}>
          <div className="profile-actions">
            <button
              className="profile-pic-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <User size={20} />
            </button>

            <button
              className="profile-dropdown-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
            >
              <span className="profile-label">Profile</span>
              <ChevronDown size={16} className={`arrow ${showProfileMenu ? 'rotate' : ''}`} />
            </button>
          </div>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="user-role">{user?.role || 'Student'}</p>
                <p className="user-email">{user?.email || 'student@skct.edu.in'}</p>
              </div>

              <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <User size={16} /> My Profile
                </button>
                <button className="dropdown-item" onClick={() => navigate('/orders')}>
                  <Package size={16} /> My Orders
                </button>
              <button className="dropdown-item">
                <Settings size={16} /> Settings
              </button>


              <button className="dropdown-item logout" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
