import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useOrders } from '../../context/OrderContext';
import { ChevronRight, Package, QrCode, Clock, MapPin, X, ArrowLeft, AlertTriangle } from 'lucide-react';
import '../../styles/pagescss/Orders.css';
import '../../styles/menucss/OrderSuccess.css';

export default function Orders() {
    const { orders } = useOrders();
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    const mockCompletedOrder = {
        id: 'DEMO123',
        shopName: 'Main Block Chat Coffee',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        total: 35.50,
        status: 'collected',
        cartItems: [
            { name: 'Veg Burger', qty: 2, price: 15.00 },
            { name: 'Cold Coffee', qty: 1, price: 5.50 }
        ]
    };

    const displayOrders = [...orders, mockCompletedOrder];

    const getStatusLabel = (status) => {
        const labels = {
            'PAID': { text: 'Paid', class: 'status_paid' },
            'PREPARING': { text: 'Preparing', class: 'status_preparing' },
            'READY_FOR_PICKUP': { text: 'Ready', class: 'status_ready' },
            'COMPLETED': { text: 'Collected', class: 'status_completed' },
            'collected': { text: 'Collected', class: 'status_completed' },
            'CANCELLED': { text: 'Cancelled', class: 'status_cancelled' }
        };
        return labels[status] || { text: status, class: '' };
    };

    return (
        <div className="orders_page_container">
            <NavBar />

            <main className="orders_main">
                <div className="orders_header">
                    <button className="orders_back_btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={18} color="#4b5563" />
                    </button>
                    <h2>My Order History</h2>
                    <p>Track and manage your campus food orders</p>
                </div>

                {displayOrders.length === 0 ? (
                    <div className="empty_orders">
                        <Package size={48} />
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders_list">
                        {displayOrders.map((order) => {
                            const statusInfo = getStatusLabel(order.status);
                            const isCancelled = order.status === 'CANCELLED';
                            return (
                                <div
                                    key={order.id}
                                    className={`order_history_card ${statusInfo.class} ${isCancelled ? 'cancelled' : ''}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="order_info_left">
                                        <span className="order_shop_name">{order.shopName}</span>
                                        <span className="order_date">
                                            {new Date(order.timestamp).toLocaleDateString()} • {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="order_id_badge">#{order.orderId || order.id}</span>
                                    </div>

                                    <div className="order_info_right">
                                        <span className="order_total_price">₹{order.total.toFixed(2)}</span>
                                        <span className={`order_status_pill ${statusInfo.class}`}>
                                            {statusInfo.text}
                                        </span>
                                        <ChevronRight size={18} color="#9ca3af" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                />
            )}
        </div>
    );
}

const OrderDetailsModal = ({ order, onClose }) => {
    const { cancelOrder } = useOrders();
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const handleUserCancel = () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }
        cancelOrder(order.orderId || order.id, cancelReason);
        setShowCancelConfirm(false);
        onClose();
    };

    return (
        <div className="success_overlay" style={{ zIndex: 2000 }}>
            <div className="success_modal">
                <button className="close_success_btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="success_body order_modal_body">
                    <h2 className="success_title">Order Details</h2>
                    <p className="order_id">Order ID: #{order.orderId || order.id}</p>

                    <div className="success_info_card order_modal_info_card">
                        <div className="info_row">
                            <MapPin size={18} className="info_icon" />
                            <div className="info_text">
                                <span className="info_label">Shop</span>
                                <span className="info_value">{order.shopName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr_section">
                        <div className="qr_container">
                            <QrCode size={120} strokeWidth={1.5} className="qr_icon" />
                            <div className="qr_scan_line"></div>
                        </div>
                        <p className={`qr_text ${order.status === 'collected' ? 'qr_collected_text' : ''}`}>
                            {order.status === 'collected'
                                ? 'Order already collected'
                                : 'Show this QR to the vendor to collect'}
                        </p>
                    </div>

                    <div className="summary_mini">
                        <div className="summary_header">Items</div>
                        <div className="mini_list">
                            {order.cartItems.map((item, idx) => (
                                <div key={idx} className="mini_item">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mini_total">
                            <span>Total Paid</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>

                    {order.status === 'CANCELLED' && (
                        <div className="order_cancellation_banner">
                            <div className="cancellation_header">
                                <AlertTriangle size={16} />
                                <span>Order Cancelled</span>
                            </div>
                            <p className="cancellation_reason">
                                <strong>Reason:</strong> {order.cancelReason || 'No reason provided'}
                            </p>
                            <span className="cancellation_meta">
                                By {order.cancelledBy === 'ADMIN' ? 'Administrator' : 'You'} on {new Date(order.cancelledAt).toLocaleString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="success_footer">
                    {order.status === 'PAID' && !showCancelConfirm && (
                        <button
                            className="done_btn cancel_order_trigger"
                            style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2' }}
                            onClick={() => setShowCancelConfirm(true)}
                        >
                            Cancel Order
                        </button>
                    )}

                    {showCancelConfirm ? (
                        <div className="cancel_confirm_box" style={{ width: '100%' }}>
                            <textarea
                                placeholder="Reason for cancellation (e.g., changed my mind, ordered by mistake)"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                            />
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                <button onClick={handleUserCancel} className="done_btn">Confirm Cancellation</button>
                                <button onClick={() => setShowCancelConfirm(false)} className="cancel_btn">Back</button>
                            </div>
                        </div>
                    ) : (
                        <button onClick={onClose} className="cancel_btn">Close</button>
                    )}
                </div>
            </div>
        </div>
    );
};
