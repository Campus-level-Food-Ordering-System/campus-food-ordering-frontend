import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { ChevronRight, Package, QrCode, Clock, MapPin, X, ArrowLeft, AlertTriangle } from 'lucide-react';
import userService from '../../services/userService';
import '../../styles/pagescss/Orders.css';
import '../../styles/menucss/OrderSuccess.css';

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            const res = await userService.getMyOrders();
            setOrders(res.data.data || []);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

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

    if (loading) {
        return <div className="orders_page_container"><NavBar /><div style={{textAlign: 'center', marginTop: '2rem'}}>Loading orders...</div></div>;
    }

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

                {orders.length === 0 ? (
                    <div className="empty_orders">
                        <Package size={48} />
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders_list">
                        {orders.map((order) => {
                            const statusInfo = getStatusLabel(order.status);
                            const isCancelled = order.status === 'CANCELLED';
                            return (
                                <div
                                    key={order.id}
                                    className={`order_history_card ${statusInfo.class} ${isCancelled ? 'cancelled' : ''}`}
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="order_info_left">
                                        <span className="order_shop_name">{order.vendorName || order.shopName || `Vendor ${order.vendorId}`}</span>
                                        <span className="order_date">
                                            {new Date(order.createdAt || order.timestamp).toLocaleDateString()} • {new Date(order.createdAt || order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        <span className="order_id_badge">#{order.id}</span>
                                    </div>

                                    <div className="order_info_right">
                                        <span className="order_total_price">₹{Number(order.totalAmount || order.total).toFixed(2)}</span>
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
                    onClose={() => {
                        setSelectedOrder(null);
                        fetchOrders();
                    }}
                />
            )}
        </div>
    );
}

const OrderDetailsModal = ({ order, onClose }) => {
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);
    const [qrToken, setQrToken] = useState(null);

    useEffect(() => {
        if (order.status !== 'CANCELLED' && order.status !== 'COMPLETED' && order.status !== 'collected') {
            userService.getQrCode(order.id)
                .then(res => {
                    setQrToken(res.data.data.token);
                })
                .catch(err => console.error("Failed to load QR token:", err));
        }
    }, [order.id, order.status]);

    const handleUserCancel = async () => {
        if (!cancelReason.trim()) {
            alert('Please provide a reason for cancellation.');
            return;
        }
        setIsCancelling(true);
        try {
            await userService.cancelOrder(order.id, { reason: cancelReason });
            setShowCancelConfirm(false);
            onClose();
        } catch (error) {
            console.error("Failed to cancel order:", error);
            alert("Failed to cancel order. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    const isCancelled = order.status === 'CANCELLED';
    const isCompleted = order.status === 'COMPLETED' || order.status === 'collected';
    const items = order.items || order.cartItems || [];
    const totalAmount = order.totalAmount || order.total;

    return (
        <div className="success_overlay" style={{ zIndex: 2000 }}>
            <div className="success_modal">
                <button className="close_success_btn" onClick={onClose}>
                    <X size={20} />
                </button>

                <div className="success_body order_modal_body">
                    <h2 className="success_title">Order Details</h2>
                    <p className="order_id">Order ID: #{order.id}</p>

                    <div className="success_info_card order_modal_info_card">
                        <div className="info_row">
                            <MapPin size={18} className="info_icon" />
                            <div className="info_text">
                                <span className="info_label">Shop</span>
                                <span className="info_value">{order.vendorName || order.shopName || `Vendor ${order.vendorId}`}</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr_section">
                        <div className="qr_container">
                            <QrCode size={120} strokeWidth={1.5} className="qr_icon" />
                            {!isCompleted && !isCancelled && <div className="qr_scan_line"></div>}
                        </div>
                        <p className={`qr_text ${isCompleted ? 'qr_collected_text' : ''}`}>
                            {isCompleted
                                ? 'Order already collected'
                                : isCancelled 
                                    ? 'Order Cancelled' 
                                    : 'Show this QR to the vendor to collect'}
                        </p>
                        {qrToken && <p style={{fontSize: '12px', marginTop: '5px', color: '#6b7280'}}>Token: {qrToken}</p>}
                    </div>

                    <div className="summary_mini">
                        <div className="summary_header">Items</div>
                        <div className="mini_list">
                            {items.map((item, idx) => (
                                <div key={idx} className="mini_item">
                                    <span>{item.quantity || item.qty}x {item.itemName || item.name}</span>
                                    <span>₹{((item.price || item.unitPrice) * (item.quantity || item.qty)).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mini_total">
                            <span>Total Paid</span>
                            <span>₹{Number(totalAmount).toFixed(2)}</span>
                        </div>
                    </div>

                    {isCancelled && (
                        <div className="order_cancellation_banner">
                            <div className="cancellation_header">
                                <AlertTriangle size={16} />
                                <span>Order Cancelled</span>
                            </div>
                            <p className="cancellation_reason">
                                <strong>Reason:</strong> {order.cancelReason || 'No reason provided'}
                            </p>
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
                                <button onClick={handleUserCancel} className="done_btn" disabled={isCancelling}>
                                    {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                                </button>
                                <button onClick={() => setShowCancelConfirm(false)} className="cancel_btn" disabled={isCancelling}>Back</button>
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
