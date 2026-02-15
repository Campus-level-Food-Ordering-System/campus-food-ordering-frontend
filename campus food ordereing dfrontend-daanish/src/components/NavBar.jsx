import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Package, LogOut, ChevronDown, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import avatarImg from '../assets/avatar.png';
import '../styles/dashboardcss/NavBar.css';

export default function NavBar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signin');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Left Side: Logo & Location */}
        <div className="navbar-left">
          <div className="logo-section">
            <div className="logo-emoji">🍕</div>
            <div className="logo-text">
              <h1>CampusEats</h1>
              <p>Good food. Zero distance.</p>
            </div>
          </div>




        </div>
        <div className="navbar-right">
          {/* Profile Section */}
          <div className="profile-section">
            <div className="profile-actions">
              <button
                className="profile-pic-btn"
                onClick={() => navigate('/profile')}
                title="Go to My Profile"
              >
                <img src={avatarImg} alt="Profile" className="navbar-profile-img" />
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
                  <p className="user-name">{user?.name || user?.email?.split('@')[0] || "Vindhan"}</p>
                  <p className="user-role">{user?.role || 'Student'}</p>
                  <p className="user-email">studentuser1@skct</p>
                </div>
                <button className="dropdown-item" onClick={() => navigate('/profile')}>
                  <User size={16} /> My Profile
                </button>
                <button className="dropdown-item">
                  <Settings size={16} /> Settings
                </button>
                <button className="dropdown-item">
                  <Package size={16} /> My Orders
                </button>
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}