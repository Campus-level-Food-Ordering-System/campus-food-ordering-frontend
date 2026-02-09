import React from 'react';
import {
    LayoutDashboard,
    Users,
    ShoppingBag,
    CreditCard,
    LogOut,
    X
} from 'lucide-react';
import '../../styles/admincss/AdminDashboard.css';

const AdminSidebar = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
    const menuItems = [
        { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'vendors', label: 'Vendors', icon: Users },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'payments', label: 'Payments', icon: CreditCard },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="admin_sidebar_overlay"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}

            <aside className={`admin_sidebar ${isOpen ? 'open' : ''}`}>
                <div className="admin_sidebar_header">
                    <div className="admin_logo">
                        <div className="logo_icon">A</div>
                        <span>Admin Panel</span>
                    </div>
                    <button
                        className="admin_sidebar_close"
                        onClick={() => setIsOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="admin_nav">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                className={`admin_nav_item ${activeTab === item.id ? 'active' : ''}`}
                                onClick={() => {
                                    setActiveTab(item.id);
                                    setIsOpen(false);
                                }}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                                {activeTab === item.id && <div className="active_indicator" />}
                            </button>
                        );
                    })}
                </nav>

                <div className="admin_sidebar_footer">
                    <button className="admin_logout_btn" onClick={() => window.location.href = '/'}>
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
