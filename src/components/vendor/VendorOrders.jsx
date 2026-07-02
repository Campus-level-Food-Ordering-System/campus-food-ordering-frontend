import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import vendorService from '../../services/vendorService';
import '../../styles/vendorcss/VendorOrders.css';

export default function VendorOrders({ onNewOrder, shopId }) {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('all');
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const params = filter === 'all' ? {} : { status: filter };
            const res = await vendorService.getOrders(params);
            const fetchedOrders = res.data.data || [];
            setOrders(fetchedOrders);
            
            // If viewing all, calculate new orders (PAID)
            if (filter === 'all') {
                const newOrdersCount = fetchedOrders.filter(o => o.status === 'PAID').length;
                onNewOrder?.(newOrdersCount);
            }
        } catch (err) {
            console.error("Failed to fetch vendor orders:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchOrders();
        // Set up polling every 30 seconds for new orders
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [filter, shopId]); // Added shopId in dependency just in case it changes

    const handleUpdateStatus = async (orderId, newStatus) => {
        try {
            await vendorService.updateOrderStatus(orderId, { status: newStatus });
            // Optimistically update or refetch
            fetchOrders();
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update order status.");
        }
    };

    // Get next status
    const getNextStatus = (currentStatus) => {
        const statusFlow = {
            PAID: 'PREPARING',
            PREPARING: 'READY_FOR_PICKUP',
            READY_FOR_PICKUP: 'COMPLETED',
        };
        return statusFlow[currentStatus];
    };

    // Format time
    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const badges = {
            PAID: { label: 'New Order', icon: AlertCircle, className: 'status-paid' },
            PREPARING: { label: 'Preparing', icon: Package, className: 'status-preparing' },
            READY_FOR_PICKUP: { label: 'Ready', icon: CheckCircle, className: 'status-ready' },
        };
        return badges[status] || { label: status, icon: Clock, className: '' };
    };

    if (loading) {
        return <div className="vendor_orders"><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading orders...</div></div>;
    }

    return (
        <div className="vendor_orders">
            <div className="orders_header">
                <h2>Incoming Orders</h2>
                <div className="orders_filters">
                    <button
                        onClick={() => setFilter('all')}
                        className={`filter_btn ${filter === 'all' ? 'active' : ''}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('PAID')}
                        className={`filter_btn ${filter === 'PAID' ? 'active' : ''}`}
                    >
                        New
                    </button>
                    <button
                        onClick={() => setFilter('PREPARING')}
                        className={`filter_btn ${filter === 'PREPARING' ? 'active' : ''}`}
                    >
                        Preparing
                    </button>
                    <button
                        onClick={() => setFilter('READY_FOR_PICKUP')}
                        className={`filter_btn ${filter === 'READY_FOR_PICKUP' ? 'active' : ''}`}
                    >
                        Ready
                    </button>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="orders_empty">
                    <Package size={48} />
                    <p>No orders found yet</p>
                </div>
            ) : (
                <div className="orders_grid">
                    {orders.map((order) => {
                        const statusBadge = getStatusBadge(order.status);
                        const StatusIcon = statusBadge.icon;
                        const nextStatus = getNextStatus(order.status);

                        // Map items for display
                        const itemsToDisplay = order.items || [];

                        return (
                            <div key={order.orderId || order.id} className="order_card">
                                <div className="order_header">
                                    <div className="order_id">
                                        <span className="order_number">#{order.orderId || order.id}</span>
                                        <span className="order_time">
                                            <Clock size={14} />
                                            {formatTime(order.createdAt || order.timestamp)}
                                        </span>
                                    </div>
                                    <div className={`order_status ${statusBadge.className}`}>
                                        <StatusIcon size={16} />
                                        {statusBadge.label}
                                    </div>
                                </div>

                                <div className="order_customer">
                                    <strong>{order.customerName || order.studentName}</strong>
                                </div>

                                <div className="order_items">
                                    {itemsToDisplay.map((item, idx) => (
                                        <div key={idx} className="order_item">
                                            <span className="item_name">
                                                {item.quantity}x {item.itemName || item.name}
                                            </span>
                                            <span className="item_price">₹{(item.unitPrice * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order_footer">
                                    <div className="order_total">
                                        <strong>Total:</strong>
                                        <span className="total_amount">₹{parseFloat(order.totalAmount || order.total).toFixed(2)}</span>
                                    </div>
                                    {nextStatus && nextStatus !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.orderId || order.id, nextStatus)}
                                            className="order_action_btn"
                                        >
                                            {nextStatus === 'PREPARING' && 'Start Preparing'}
                                            {nextStatus === 'READY_FOR_PICKUP' && 'Mark Ready'}
                                        </button>
                                    )}
                                    {order.status === 'CANCELLED' && (
                                        <div className="vendor_cancel_banner_container">
                                            <div className="vendor_cancel_banner">
                                                <div className="v_cancel_header">
                                                    <AlertCircle size={16} />
                                                    <div>
                                                        <strong>Cancelled by {order.cancelledBy === 'ADMIN' ? 'Admin' : 'User'}</strong>
                                                        {order.cancelledAt && (
                                                            <p className="v_cancel_time">on {new Date(order.cancelledAt).toLocaleDateString()} at {new Date(order.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {order.cancelReason && (
                                                    <div className="v_cancel_reason_box">
                                                        <strong>Reason:</strong>
                                                        <p>"{order.cancelReason}"</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
