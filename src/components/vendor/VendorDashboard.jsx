import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, BarChart3, User, LogOut, Bell, AlertCircle } from 'lucide-react';
import vendorService from '../../services/vendorService';
import VendorOrders from './VendorOrders';
import VendorMenu from './VendorMenu';
import VendorAnalytics from './VendorAnalytics';
import VendorProfile from './VendorProfile';
import '../../styles/vendorcss/VendorDashboard.css';

export default function VendorDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('orders');
    const [newOrderCount, setNewOrderCount] = useState(0);
    const [vendorProfile, setVendorProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const shopId = vendorProfile?.vendorId?.toString() || "1";

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await vendorService.getProfile();
                setVendorProfile(res.data.data);
            } catch (err) {
                console.error("Failed to fetch vendor profile", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/signin');
    };

    const handleToggleStatus = () => {
        // Toggle locally since no backend endpoint exists
        if (vendorProfile && vendorProfile.status !== 'SUSPENDED') {
            setVendorProfile(prev => ({
                ...prev,
                isOpen: !prev.isOpen
            }));
        }
    };

    const tabs = [
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'menu', label: 'Menu', icon: Package },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'profile', label: 'Profile', icon: User },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'orders':
                return <VendorOrders onNewOrder={(count) => setNewOrderCount(count)} shopId={shopId} />;
            case 'menu':
                return <VendorMenu shopId={shopId} />;
            case 'analytics':
                return <VendorAnalytics shopId={shopId} />;
            case 'profile':
                return <VendorProfile shopId={shopId} profile={vendorProfile} />;
            default:
                return <VendorOrders onNewOrder={(count) => setNewOrderCount(count)} shopId={shopId} />;
        }
    };

    if (loading) {
        return <div className="vendor_dashboard"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading vendor data...</div></div>;
    }

    const isActive = vendorProfile?.status !== 'SUSPENDED';
    const isOpen = vendorProfile?.isOpen;

    return (
        <div className="vendor_dashboard">
            {/* Header */}
            <header className="vendor_header">
                <div className="vendor_header_content">
                    <div className="vendor_logo">
                        <h1>🍽️ {vendorProfile?.vendorName || 'CampusEats Vendor'}</h1>
                        <p className="vendor_email">{user?.email}</p>
                    </div>

                    <div className="vendor_header_actions">
                        <div className={`shop_status_toggle ${isOpen && isActive ? 'active' : 'inactive'} ${!isActive ? 'suspended' : ''}`}
                            onClick={handleToggleStatus}
                            title={!isActive ? "Disabled by Administrator" : ""}>
                            <span className="status_label">
                                {!isActive ? 'Shop Suspended' : (isOpen ? 'Shop Open' : 'Shop Closed')}
                            </span>
                            <div className="toggle_switch">
                                <div className="toggle_knob"></div>
                            </div>
                        </div>

                        {!isActive && (
                            <div className="admin_suspension_alert">
                                <AlertCircle size={16} />
                                <span>Platform access restricted by Admin</span>
                            </div>
                        )}

                        {newOrderCount > 0 && (
                            <div className="notification_badge">
                                <Bell size={20} />
                                <span className="badge_count">{newOrderCount}</span>
                            </div>
                        )}
                        <button onClick={handleLogout} className="logout_btn">
                            <LogOut size={18} />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="vendor_nav">
                <div className="vendor_nav_content">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`nav_tab ${activeTab === tab.id ? 'active' : ''}`}
                            >
                                <Icon size={20} />
                                <span>{tab.label}</span>
                                {tab.id === 'orders' && newOrderCount > 0 && (
                                    <span className="tab_badge">{newOrderCount}</span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Main Content */}
            <main className="vendor_main">
                <div className="vendor_content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
