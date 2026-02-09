import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ShopNameCard from './ShopNameCard';
import { useMenu } from '../../context/MenuContext';
import '../../styles/usercss/StudentDashboard.css';

export default function Dashboard() {
    const navigate = useNavigate();
    const { shops } = useMenu();

    const handleShopClick = (shopId) => {
        console.log("Navigating to shop:", shopId);
        navigate(`/menu/${shopId}`);
    };

    return (
        <div className="student_dashboard_container">
            <NavBar />

            <main className="student_dashboard_main">
                <div className="student_welcome_banner">
                    <h2>Welcome to CampusEats! 🎉</h2>
                    <p>Choose your favorite shop to start ordering</p>
                </div>

                <div className="student_shops_grid">
                    {shops.map((shop) => (
                        <ShopNameCard
                            key={shop.vendorId}
                            name={shop.name}
                            image={shop.image}
                            isOpen={shop.isOpen}
                            isActive={shop.isActive}
                            onClick={() => handleShopClick(shop.vendorId)}
                        />
                    ))}
                </div>
            </main>
        </div>
    );
}
