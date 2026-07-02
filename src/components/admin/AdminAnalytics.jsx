import React, { useState, useEffect, useMemo } from 'react';
import { Users, ShoppingBag, DollarSign, Store, TrendingUp, ArrowUpRight } from 'lucide-react';
import adminService from '../../services/adminService';

const AdminAnalytics = () => {
    const [statsData, setStatsData] = useState({
        totalUsers: 0,
        totalVendors: 0,
        totalOrders: 0,
        totalRevenue: 0
    });
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [dashRes, ordersRes] = await Promise.all([
                    adminService.getDashboard(),
                    adminService.getOrders()
                ]);
                
                const dashData = dashRes.data.data;
                setStatsData({
                    totalUsers: dashData.totalUsers || 0,
                    totalVendors: dashData.totalVendors || 0,
                    totalOrders: dashData.totalOrders || 0,
                    totalRevenue: dashData.totalRevenue || 0
                });
                
                setOrders(ordersRes.data.data || []);
            } catch (err) {
                console.error("Failed to fetch admin analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    const stats = useMemo(() => {
        return [
            {
                label: 'Total Users',
                value: statsData.totalUsers.toLocaleString(),
                icon: Users,
                color: '#6366f1',
                bg: '#eef2ff',
                trend: '+12%'
            },
            {
                label: 'Total Vendors',
                value: statsData.totalVendors.toLocaleString(),
                icon: Store,
                color: '#10b981',
                bg: '#ecfdf5',
                trend: '+2'
            },
            {
                label: 'Total Orders',
                value: statsData.totalOrders.toLocaleString(),
                icon: ShoppingBag,
                color: '#f59e0b',
                bg: '#fffbeb',
                trend: '+18%'
            },
            {
                label: 'Total Revenue',
                value: `₹${Number(statsData.totalRevenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                icon: DollarSign,
                color: '#8b5cf6',
                bg: '#f5f3ff',
                trend: '+24%'
            },
        ];
    }, [statsData]);

    // Trend Data Calculation
    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toDateString();
            const dailyOrders = orders.filter(o => {
                const orderDate = new Date(o.createdAt || o.timestamp);
                return orderDate.toDateString() === dStr;
            });
            const revenue = dailyOrders.reduce((sum, o) => sum + (parseFloat(o.totalAmount || o.amount) || 0), 0);
            weekly.push({
                label: days[d.getDay()],
                revenue: revenue,
                count: dailyOrders.length
            });
        }
        return weekly;
    }, [orders]);

    if (loading) {
        return <div className="admin_section"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading analytics...</div></div>;
    }

    return (
        <div className="admin_section analytics_dashboard">
            <div className="stats_grid">
                {stats.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <div key={idx} className="stat_card">
                            <div className="stat_icon_wrapper" style={{ backgroundColor: stat.bg, color: stat.color }}>
                                <Icon size={24} />
                            </div>
                            <div className="stat_info">
                                <span className="stat_label">{stat.label}</span>
                                <h2 className="stat_value">{stat.value}</h2>
                                <div className="stat_trend positive">
                                    <ArrowUpRight size={14} />
                                    <span>{stat.trend} from last month</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="charts_row">
                <div className="chart_card revenue_chart">
                    <div className="chart_header">
                        <div className="header_info">
                            <h3>Revenue Overview</h3>
                            <p>Daily performance of the platform</p>
                        </div>
                        <div className="header_action">
                            <select className="chart_filter">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                    </div>

                    <div className="admin_chart_mock">
                        {chartData.map((data, idx) => {
                            const maxRev = Math.max(...chartData.map(d => d.revenue), 100);
                            const height = (data.revenue / maxRev) * 80 + 10;
                            return (
                                <div key={idx} className="chart_bar_group">
                                    <div className="chart_bar_container">
                                        <div
                                            className="chart_bar_fill"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="bar_tooltip">₹{data.revenue.toFixed(0)}</div>
                                        </div>
                                    </div>
                                    <span className="bar_label">{data.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="chart_card activity_card">
                    <h3>Recent Growth</h3>
                    <div className="growth_list">
                        <div className="growth_item">
                            <div className="growth_indicator positive"></div>
                            <div className="growth_desc">
                                <strong>New Vendor Request</strong>
                                <span>"Campus Grill" applied for partnership</span>
                            </div>
                            <span className="growth_time">2h ago</span>
                        </div>
                        <div className="growth_item">
                            <div className="growth_indicator positive"></div>
                            <div className="growth_desc">
                                <strong>High Traffic Alert</strong>
                                <span>Order volume up 40% during lunch hour</span>
                            </div>
                            <span className="growth_time">5h ago</span>
                        </div>
                        <div className="growth_item">
                            <div className="growth_indicator neutral"></div>
                            <div className="growth_desc">
                                <strong>System Update</strong>
                                <span>Platform backup completed successfully</span>
                            </div>
                            <span className="growth_time">12h ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
