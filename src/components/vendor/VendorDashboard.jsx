import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Package, ShoppingBag, BarChart3, User, LogOut, Bell, AlertCircle } from 'lucide-react';
import { useMenu } from '../../context/MenuContext';
import VendorOrders from './VendorOrders';
import VendorMenu from './VendorMenu';
import VendorAnalytics from './VendorAnalytics';
import VendorProfile from './VendorProfile';
import '../../styles/vendorcss/VendorDashboard.css';

export default function VendorDashboard() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { shops, toggleShopStatus } = useMenu();
    const [activeTab, setActiveTab] = useState('orders');
    const [newOrderCount, setNewOrderCount] = useState(0);

    const shopId = user?.vendorId?.toString() || "1";
    const currentShop = shops.find(s => s.vendorId.toString() === shopId.toString());

    const handleLogout = () => {
        logout();
        navigate('/signin');
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
                return <VendorProfile shopId={shopId} />;
            default:
                return <VendorOrders onNewOrder={(count) => setNewOrderCount(count)} shopId={shopId} />;
        }
    };

    return (
        <div className="vendor_dashboard">
            {/* Header */}
            <header className="vendor_header">
                <div className="vendor_header_content">
                    <div className="vendor_logo">
                        <h1>🍽️ CampusEats Vendor</h1>
                        <p className="vendor_email">{user?.email}</p>
                    </div>

                    <div className="vendor_header_actions">
                        <div className={`shop_status_toggle ${currentShop?.isOpen && currentShop?.isActive ? 'active' : 'inactive'} ${!currentShop?.isActive ? 'suspended' : ''}`}
                            onClick={() => currentShop?.isActive && toggleShopStatus(shopId)}
                            title={!currentShop?.isActive ? "Disabled by Administrator" : ""}>
                            <span className="status_label">
                                {!currentShop?.isActive ? 'Shop Suspended' : (currentShop?.isOpen ? 'Shop Open' : 'Shop Closed')}
                            </span>
                            <div className="toggle_switch">
                                <div className="toggle_knob"></div>
                            </div>
                        </div>

                        {!currentShop?.isActive && (
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
