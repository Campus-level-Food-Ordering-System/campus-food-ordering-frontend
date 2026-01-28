import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, Package, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
        {/* Logo Section */}
        <div className="logo-section" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
          <div className="logo-emoji">🍕</div>
          <div className="logo-text">
            <h1>CampusEats</h1>
            <p>Order your favorite food</p>
          </div>
        </div>

        {/* Profile Section */}
        <div className="profile-section">
          <button
            className="profile-btn"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <div className="profile-icon"><User size={20} /></div>
            <span className="profile-label">Profile</span>
            <ChevronDown size={16} className={`arrow ${showProfileMenu ? 'rotate' : ''}`} />
          </button>

          {showProfileMenu && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <p className="user-role">{user?.role || 'Student'}</p>
                <p className="user-email">{user?.email || 'student@skct.edu.in'}</p>
              </div>
              <button className="dropdown-item">
                <Settings size={16} /> Settings
              </button>
              <button className="dropdown-item" onClick={() => navigate('/orders')}>
                <Package size={16} /> My Orders
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