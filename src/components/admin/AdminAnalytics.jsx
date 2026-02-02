import React, { useMemo } from 'react';
import { Users, ShoppingBag, DollarSign, Store, TrendingUp, ArrowUpRight } from 'lucide-react';
import { useOrders } from '../../context/OrderContext';
import { useMenu } from '../../context/MenuContext';

const AdminAnalytics = () => {
    const { orders } = useOrders();
    const { shops } = useMenu();

    // Mock users count (since we don't have a global users context yet, 
    // but we can estimate from localStorage or unique customerNames in orders)
    const totalUsersEstimate = useMemo(() => {
        const uniqueCustomers = new Set(orders.map(o => o.customerName));
        return Math.max(uniqueCustomers.size, 12) + 1200; // Adding mock base offset for demo
    }, [orders]);

    const stats = useMemo(() => {
        const totalRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
        const activeVendors = shops.length;
        const totalOrders = orders.length;

        return [
            {
                label: 'Total Users',
                value: totalUsersEstimate.toLocaleString(),
                icon: Users,
                color: '#6366f1',
                bg: '#eef2ff',
                trend: '+12%'
            },
            {
                label: 'Total Vendors',
                value: activeVendors.toLocaleString(),
                icon: Store,
                color: '#10b981',
                bg: '#ecfdf5',
                trend: '+2'
            },
            {
                label: 'Total Orders',
                value: totalOrders.toLocaleString(),
                icon: ShoppingBag,
                color: '#f59e0b',
                bg: '#fffbeb',
                trend: '+18%'
            },
            {
                label: 'Total Revenue',
                value: `₹${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
                icon: DollarSign,
                color: '#8b5cf6',
                bg: '#f5f3ff',
                trend: '+24%'
            },
        ];
    }, [orders, shops, totalUsersEstimate]);

    // Trend Data Calculation
    const chartData = useMemo(() => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekly = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dStr = d.toDateString();
            const dailyOrders = orders.filter(o => new Date(o.timestamp).toDateString() === dStr);
            const revenue = dailyOrders.reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);
            weekly.push({
                label: days[d.getDay()],
                revenue: revenue,
                count: dailyOrders.length
            });
        }
        return weekly;
    }, [orders]);

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
