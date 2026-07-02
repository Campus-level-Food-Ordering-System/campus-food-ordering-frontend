import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, ShoppingBag, Clock } from 'lucide-react';
import vendorService from '../../services/vendorService';
import '../../styles/vendorcss/VendorAnalytics.css';

export default function VendorAnalytics({ shopId }) {
    const [analytics, setAnalytics] = useState({
        todayOrders: 0,
        todayRevenue: 0,
        avgOrderValue: 0,
        peakHour: 'N/A',
        weeklyData: [] // Store day-wise counts
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalyticsAndOrders = async () => {
            try {
                const [analyticsRes, ordersRes] = await Promise.all([
                    vendorService.getAnalytics(),
                    vendorService.getOrders({})
                ]);

                const backendAnalytics = analyticsRes.data.data;
                const vendorOrders = ordersRes.data.data || [];

                const todayOrdersList = vendorOrders.filter(o => {
                    const orderDate = new Date(o.createdAt || o.timestamp);
                    const todayDate = new Date();
                    return orderDate.toDateString() === todayDate.toDateString();
                });

                // Peak Hour
                const hourCounts = {};
                todayOrdersList.forEach(o => {
                    const hour = new Date(o.createdAt || o.timestamp).getHours();
                    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
                });

                let peak = 'N/A';
                let maxDailyCount = 0;
                Object.entries(hourCounts).forEach(([hour, count]) => {
                    if (count > maxDailyCount) {
                        maxDailyCount = count;
                        const h = parseInt(hour);
                        const ampm = h >= 12 ? 'PM' : 'AM';
                        const displayH = h % 12 || 12;
                        peak = `${displayH}:00 ${ampm} - ${displayH + 1}:00 ${ampm}`;
                    }
                });

                // Weekly Trends (Last 7 Days)
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const weekly = [];
                for (let i = 6; i >= 0; i--) {
                    const d = new Date();
                    d.setDate(d.getDate() - i);
                    const dStr = d.toDateString();
                    const count = vendorOrders.filter(o => new Date(o.createdAt || o.timestamp).toDateString() === dStr).length;
                    weekly.push({
                        label: days[d.getDay()],
                        count: count
                    });
                }

                setAnalytics({
                    todayOrders: backendAnalytics.todayOrders,
                    todayRevenue: backendAnalytics.todayRevenue,
                    avgOrderValue: backendAnalytics.todayOrders > 0 
                        ? backendAnalytics.todayRevenue / backendAnalytics.todayOrders 
                        : 0,
                    peakHour: peak,
                    weeklyData: weekly
                });

            } catch (err) {
                console.error("Failed to fetch analytics", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsAndOrders();
    }, [shopId]);

    const stats = [
        {
            label: "Today's Orders",
            value: analytics.todayOrders,
            icon: ShoppingBag,
            color: '#4CAF50',
            bgColor: '#E8F5E9',
        },
        {
            label: "Today's Revenue",
            value: `₹${Number(analytics.todayRevenue).toFixed(2)}`,
            icon: DollarSign,
            color: '#2196F3',
            bgColor: '#E3F2FD',
        },
        {
            label: 'Avg Order Value',
            value: `₹${Number(analytics.avgOrderValue).toFixed(2)}`,
            icon: TrendingUp,
            color: '#FF9800',
            bgColor: '#FFF3E0',
        },
        {
            label: 'Peak Hour',
            value: analytics.peakHour,
            icon: Clock,
            color: '#9C27B0',
            bgColor: '#F3E5F5',
        },
    ];

    if (loading) {
        return <div className="vendor_analytics"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading analytics...</div></div>;
    }

    return (
        <div className="vendor_analytics">
            <div className="analytics_header">
                <h2>Analytics Dashboard</h2>
                <p className="analytics_subtitle">Track your performance and insights</p>
            </div>

            <div className="analytics_grid">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="analytics_card">
                            <div
                                className="analytics_icon"
                                style={{ backgroundColor: stat.bgColor, color: stat.color }}
                            >
                                <Icon size={24} />
                            </div>
                            <div className="analytics_content">
                                <p className="analytics_label">{stat.label}</p>
                                <h3 className="analytics_value">{stat.value}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="analytics_chart_placeholder">
                <h3>Sales Overview (Last 7 Days)</h3>
                <div className="chart_mock">
                    {analytics.weeklyData.map((data, idx) => {
                        // Max height calculation for proportions
                        const maxCount = Math.max(...analytics.weeklyData.map(d => d.count), 1);
                        const height = (data.count / maxCount) * 90 + 10; // min 10% height
                        return (
                            <div key={idx} className="chart_bar" style={{ height: `${height}%` }}>
                                <span className="bar_value">{data.count}</span>
                                <span>{data.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
