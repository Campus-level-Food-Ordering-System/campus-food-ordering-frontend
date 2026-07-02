import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import ShopNameCard from './ShopNameCard';
import userService from '../../services/userService';
import '../../styles/usercss/StudentDashboard.css'; 

export default function Dashboard() {
    const navigate = useNavigate();
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await userService.getVendors();
                setShops(response.data.data || []);
            } catch (error) {
                console.error("Failed to fetch vendors", error);
            } finally {
                setLoading(false);
            }
        };
        fetchVendors();
    }, []);

    const handleShopClick = (shopId) => {
        navigate(`/menu/${shopId}`);
    };

    if (loading) {
        return <div className="dashboard-container"><NavBar /><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading shops...</div></div>;
    }

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