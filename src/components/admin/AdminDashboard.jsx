import React, { useState, useEffect, useMemo } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminAnalytics from './AdminAnalytics';
import AdminVendors from './AdminVendors';
import AdminOrders from './AdminOrders';
import AdminPayments from './AdminPayments';
import { Menu, User, Bell, X } from 'lucide-react';
import adminService from '../../services/adminService';
import '../../styles/admincss/AdminDashboard.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('analytics');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [orders, setOrders] = useState([]);
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ordersRes, vendorsRes] = await Promise.all([
                    adminService.getOrders(),
                    adminService.getVendors()
                ]);
                setOrders(ordersRes.data.data || []);
                setVendors(vendorsRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch admin notifications data", err);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    // Generate dynamic notifications based on real data
    const notifications = useMemo(() => {
        const notifs = [];

        // Add recent orders
        const recentOrders = orders.slice(0, 3);
        recentOrders.forEach((order, idx) => {
            notifs.push({
                id: `order-${order.orderId}`,
                type: 'order',
                title: 'New Order',
                message: `Order #${order.orderId} placed by ${order.customerName} at ${order.vendorName}`,
                time: new Date(order.createdAt || Date.now()).toLocaleString(),
                read: idx > 0
            });
        });

        // Add vendor status updates
        vendors.forEach((shop, idx) => {
            notifs.push({
                id: `vendor-${shop.vendorId}`,
                type: 'vendor',
                title: shop.status === 'ACTIVE' ? 'Vendor Active' : 'Vendor Inactive',
                message: `${shop.vendorName} is currently ${shop.isOpen ? 'online' : 'offline'}`,
                time: new Date().toLocaleString(),
                read: idx > 0
            });
        });

        // Add revenue notifications
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalAmount || o.amount) || 0), 0);
        if (totalRevenue > 0) {
            notifs.push({
                id: 'revenue',
                type: 'payment',
                title: 'Total Revenue',
                message: `Platform revenue: ₹${totalRevenue.toFixed(2)} from ${orders.length} orders`,
                time: new Date().toLocaleString(),
                read: true
            });
        }

        return notifs.slice(0, 6); // Limit to 6 most recent
    }, [orders, vendors]);

    const renderContent = () => {
        switch (activeTab) {
            case 'analytics': return <AdminAnalytics />;
            case 'vendors': return <AdminVendors />;
            case 'orders': return <AdminOrders />;
            case 'payments': return <AdminPayments />;
            default: return <AdminAnalytics />;
        }
    };

    const getTabTitle = () => {
        const titles = {
            analytics: 'Platform Overview',
            vendors: 'Vendor Management',
            orders: 'Global Orders',
            payments: 'Payment Logs'
        };
        return titles[activeTab] || 'Admin';
    };

    return (
        <div className="admin_layout">
            <AdminSidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />

            <div className="admin_main">
                <header className="admin_topbar">
                    <div className="topbar_left">
                        <button
                            className="sidebar_toggle"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu size={24} />
                        </button>
                        <h1>{getTabTitle()}</h1>
                    </div>

                    <div className="topbar_right">
                        <div className="notification_wrapper">
                            <button
                                className="admin_action_icon"
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell size={20} />
                                {notifications.some(n => !n.read) && <span className="notification_dot" />}
                            </button>

                            {showNotifications && (
                                <div className="notification_dropdown">
                                    <div className="notification_header">
                                        <h3>Notifications</h3>
                                        <button onClick={() => setShowNotifications(false)} className="close_notif_btn">
                                            <X size={18} />
                                        </button>
                                    </div>
                                    <div className="notification_list">
                                        {notifications.length === 0 ? (
                                            <div className="empty_notifications">
                                                <p>No notifications</p>
                                            </div>
                                        ) : (
                                            notifications.map(notif => (
                                                <div
                                                    key={notif.id}
                                                    className={`notification_item ${notif.read ? 'read' : 'unread'}`}
                                                >
                                                    <div className={`notif_badge ${notif.type}`}></div>
                                                    <div className="notif_content">
                                                        <h4>{notif.title}</h4>
                                                        <p>{notif.message}</p>
                                                        <span className="notif_time">{notif.time}</span>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="admin_profile_pill">
                            <div className="admin_avatar">
                                <User size={18} />
                            </div>
                            <span className="admin_name">Admin</span>
                        </div>
                    </div>
                </header>

                <main className="admin_content">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
