import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ShopNameCard from './ShopNameCard';
// KEEP A's Context
import { useMenu } from '../../context/MenuContext'; 
// Use D's CSS (Ensure this file exists in your styles folder)
import '../../styles/usercss/StudentDashboard.css'; 

export default function Dashboard() {
    const navigate = useNavigate();
    // KEEP A's Logic
    const { shops } = useMenu(); 

    const handleShopClick = (shopId) => {
        navigate(`/menu/${shopId}`);
    };

    return (
        // USE D's Layout Structure
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
                <div className="welcome-banner">
                    <h2>Welcome to CampusEats!</h2>
                    <p>Choose from a variety of shops to order your favorite food</p>
                </div>

                <div className="shops-grid">
                    {/* Map A's data to D's UI Components */}
                    {shops.map((shop) => (
                        <ShopNameCard
                            key={shop.vendorId} // A uses vendorId
                            name={shop.name}
                            image={shop.image}
                            isOpen={shop.isOpen}
                            isActive={shop.isActive} // Keep A's extra props
                            onClick={() => handleShopClick(shop.vendorId)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}