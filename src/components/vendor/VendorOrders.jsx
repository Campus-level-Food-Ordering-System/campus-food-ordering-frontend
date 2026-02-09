import React, { useState, useEffect, useRef } from 'react';
import { Clock, CheckCircle, Package, AlertCircle } from 'lucide-react';
import '../../styles/vendorcss/VendorOrders.css';
import { useOrders } from '../../context/OrderContext';

export default function VendorOrders({ onNewOrder, shopId }) {
    const { orders, updateOrderStatus } = useOrders();
    const [filter, setFilter] = useState('all');
    const previousOrderCountRef = useRef(0);

    // Filter orders for the current vendor
    // Filter orders for the current vendor - use robust string comparison
    const vendorOrders = orders.filter(order => {
        const orderVendorId = (order.vendorId || order.shopId || order.id)?.toString();
        const currentShopId = shopId?.toString();
        return orderVendorId === currentShopId;
    });

    // Sync new order count to dashboard for notification badges
    useEffect(() => {
        const newOrdersCount = vendorOrders.filter(o => o.status === 'PAID').length;
        onNewOrder?.(newOrdersCount);
    }, [vendorOrders, onNewOrder]);

    const handleUpdateStatus = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
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

    // Filter orders by status
    const filteredOrders = vendorOrders.filter((order) => {
        if (filter === 'all') return true;
        return order.status === filter;
    });

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

    return (
        <div className="vendor_orders">
            <div className="orders_header">
                <h2>Incoming Orders</h2>
                <div className="orders_filters">
                    <button
                        onClick={() => setFilter('all')}
                        className={`filter_btn ${filter === 'all' ? 'active' : ''}`}
                    >
                        All ({vendorOrders.length})
                    </button>
                    <button
                        onClick={() => setFilter('PAID')}
                        className={`filter_btn ${filter === 'PAID' ? 'active' : ''}`}
                    >
                        New ({vendorOrders.filter(o => o.status === 'PAID').length})
                    </button>
                    <button
                        onClick={() => setFilter('PREPARING')}
                        className={`filter_btn ${filter === 'PREPARING' ? 'active' : ''}`}
                    >
                        Preparing ({vendorOrders.filter(o => o.status === 'PREPARING').length})
                    </button>
                    <button
                        onClick={() => setFilter('READY_FOR_PICKUP')}
                        className={`filter_btn ${filter === 'READY_FOR_PICKUP' ? 'active' : ''}`}
                    >
                        Ready ({vendorOrders.filter(o => o.status === 'READY_FOR_PICKUP').length})
                    </button>
                </div>
            </div>

            {vendorOrders.length === 0 ? (
                <div className="orders_empty">
                    <Package size={48} />
                    <p>No orders found yet</p>
                </div>
            ) : (
                <div className="orders_grid">
                    {filteredOrders.map((order) => {
                        const statusBadge = getStatusBadge(order.status);
                        const StatusIcon = statusBadge.icon;
                        const nextStatus = getNextStatus(order.status);

                        // Map cartItems to items for display
                        const itemsToDisplay = order.cartItems || order.items || [];

                        return (
                            <div key={order.orderId} className="order_card">
                                <div className="order_header">
                                    <div className="order_id">
                                        <span className="order_number">#{order.orderId}</span>
                                        <span className="order_time">
                                            <Clock size={14} />
                                            {formatTime(order.timestamp)}
                                        </span>
                                    </div>
                                    <div className={`order_status ${statusBadge.className}`}>
                                        <StatusIcon size={16} />
                                        {statusBadge.label}
                                    </div>
                                </div>

                                <div className="order_customer">
                                    <strong>{order.customerName}</strong>
                                </div>

                                <div className="order_items">
                                    {itemsToDisplay.map((item, idx) => (
                                        <div key={idx} className="order_item">
                                            <span className="item_name">
                                                {item.qty || item.quantity}x {item.name}
                                            </span>
                                            <span className="item_price">₹{(item.price * (item.qty || item.quantity)).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="order_footer">
                                    <div className="order_total">
                                        <strong>Total:</strong>
                                        <span className="total_amount">₹{parseFloat(order.total).toFixed(2)}</span>
                                    </div>
                                    {nextStatus && nextStatus !== 'COMPLETED' && order.status !== 'CANCELLED' && (
                                        <button
                                            onClick={() => handleUpdateStatus(order.orderId, nextStatus)}
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
                                                        <p className="v_cancel_time">on {new Date(order.cancelledAt).toLocaleDateString()} at {new Date(order.cancelledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
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
