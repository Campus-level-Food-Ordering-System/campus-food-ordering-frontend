import '../../styles/Dashboard.css';
import { useState } from 'react';
export default function Dashboard({ onLogout }) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const shops = [
    {
      id: 1,
      name: 'SKCT Main Block Chat Coffee',
      icon: '☕',
      description: 'Fresh coffee & snacks at Main Block',
      color: 'from-[#0077BE] to-[#00A8E8]'
    },
    {
      id: 2,
      name: 'PG Block Chat Coffee',
      icon: '🍰',
      description: 'Delicious treats at PG Block',
      color: 'from-[#00A8E8] to-[#00C9A7]'
    }
  ];
  return (<div className="dashboard-container">
    {/* Header */}
    <header className="dashboard-header">
      <div className="header-content">
        <div className="brand-section">
          <div className="brand-logo">🍕</div>
          <div>
            <h1 className="brand-name">
              CampusEats
            </h1>
            <p className="brand-tagline">Order your favorite food</p>
          </div>
        </div>

        {/* Profile Button */}
        <div className="profile-menu-container">
          <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="profile-button">
            <div className="profile-avatar-placeholder">
              👤
            </div>
            <span className="profile-text">Profile</span>
            <svg className={`profile-chevron ${showProfileMenu ? 'rotated' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (<div className="profile-dropdown">
            <div className="dropdown-header">
              <p className="dropdown-role">Student</p>
              <p className="dropdown-email">student@skct.edu.in</p>
            </div>
            <button onClick={() => alert('Profile settings coming soon!')} className="dropdown-item">
              ⚙️ Settings
            </button>
            <button onClick={() => alert('Orders page coming soon!')} className="dropdown-item">
              📦 My Orders
            </button>
            <button onClick={onLogout} className="dropdown-item dropdown-logout">
              🚪 Logout
            </button>
          </div>)}
        </div>
      </div>
    </header>

    {/* Main Content */}
    <main className="dashboard-main">
      <div className="welcome-section">
        <h2 className="welcome-title">Welcome to CampusEats! 🎉</h2>
        <p className="welcome-subtitle">Choose your favorite shop to start ordering</p>
      </div>

      {/* Shops Grid */}
      <div className="shops-grid">
        {shops.map((shop, index) => (<div key={shop.id} className="shop-card group" style={{ animationDelay: `${index * 0.1}s` }} onClick={() => alert(`Opening ${shop.name}...`)}>
          <div className="shop-banner" style={{ background: `linear-gradient(to bottom right, ${shop.color.replace('from-', '').replace('to-', '').replace('[', '').replace(']', '').split(' ').join(', ')})` }}>
            {shop.icon}
          </div>
          <div className="shop-info">
            <h3 className="shop-name">{shop.name}</h3>
            <p className="shop-desc">{shop.description}</p>
            <button className="browse-button">
              Browse Menu →
            </button>
          </div>
        </div>))}
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⚡</div>
          <h4 className="stat-value">15 min</h4>
          <p className="stat-label">Avg Delivery Time</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <h4 className="stat-value">20% OFF</h4>
          <p className="stat-label">First Order Discount</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <h4 className="stat-value">4.8/5</h4>
          <p className="stat-label">Customer Rating</p>
        </div>
      </div>
    </main>


  </div>);
}
