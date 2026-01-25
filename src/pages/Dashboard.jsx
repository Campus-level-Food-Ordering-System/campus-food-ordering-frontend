import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ShopNameCard from '../components/ShopNameCard';
import { SHOPS_LIST } from '../data/mockData'; // dataset of shops
import '../styles/dashboardcss/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const shops = SHOPS_LIST;
  
  const handleShopClick = (shopId) => {
    // Navigate to shop detail page or open modal
    console.log("Navigating to shop:", shopId);
    navigate(`/menu/${shopId}`);
  };

  return (
    <div className="dashboard-container">
      <NavBar />

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h2>Welcome to CampusEats! 🎉</h2>
          <p>Choose your favorite shop to start ordering</p>
        </div>

        {/* Shops Grid */}
        <div className="shops-grid">
          {shops.map((shop) => (
            <ShopNameCard 
              key={shop.id}
              name={shop.name}
              image={shop.image}
              isOpen={shop.isOpen}
              onClick={() => handleShopClick(shop.id)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}