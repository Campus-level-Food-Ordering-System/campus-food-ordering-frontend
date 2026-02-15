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
      <div className="animated-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
        <div className="blob blob-5"></div>
        <div className="blob blob-6"></div>
        <div className="blob blob-7"></div>
        <div className="blob blob-8"></div>
        <div className="blob blob-9"></div>
      </div>
      <NavBar />

      <main className="dashboard-main">
        {/* Welcome Banner */}
        <div className="welcome-banner">
          <h2>Welcome to CampusEats!</h2>
          <p>Choose from a variety of shops to order your favorite food</p>
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