import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import { useOrders } from '../context/OrderContext';
import { ChevronRight, Package, QrCode, Clock, MapPin, X, ArrowLeft } from 'lucide-react';
import '../styles/pagescss/Orders.css';
import '../styles/menucss/OrderSuccess.css';

export default function Orders() {
    const { orders } = useOrders();
    const navigate = useNavigate();
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Temporary ONE mock completed order for demonstration
    const mockCompletedOrder = {
        id: 'DEMO123',
        shopName: 'Main Block Chat Coffee',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        total: 35.50,
        status: 'collected',
        cartItems: [
            { name: 'Veg Burger', qty: 2, price: 15.00 },
            { name: 'Cold Coffee', qty: 1, price: 5.50 }
        ]
    };

    // Combine real orders (already sorted by latest first in addOrder) and then add the one mock order at the end
    const displayOrders = [...orders, mockCompletedOrder];

    return (
        <div className="orders-page-container">
            <NavBar />

            <main className="orders-main">
                <div className="orders-header">
                    <button className="gaaaa-back-btn" onClick={() => navigate('/dashboard')}>
                        <ArrowLeft size={18} color="#4b5563" />
                    </button>
                    <h2>My Order History</h2>
                    <p>Track and manage your campus food orders</p>
                </div>

                {displayOrders.length === 0 ? (
                    <div className="empty-orders">
                        <Package size={48} />
                        <p>You haven't placed any orders yet.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {displayOrders.map((order) => (
                            <div
                                key={order.id}
                                className={`order-history-card ${order.status}`}
                                onClick={() => setSelectedOrder(order)}
                            >
                                <div className="order-info-left">
                                    <span className="order-shop-name">{order.shopName}</span>
                                    <span className="order-date">
                                        {new Date(order.timestamp).toLocaleDateString()} • {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className="order-id-badge">#{order.id}</span>
                                </div>

                                <div className="order-info-right">
                                    <span className="order-total-price">₹{order.total.toFixed(2)}</span>
                                    <span className={`order-status-pill ${order.status}`}>
                                        {order.status}
                                    </span>
                                    <ChevronRight size={18} color="#9ca3af" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Order Detail Overlay */}
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
    return (
        <div className="success-overlay" style={{ zIndex: 2000 }}>
            <div className="success-modal">
                <button className="close-success-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="success-body order-modal-body">
                    <h2 className="success-title">Order Details</h2>
                    <p className="order-id-text">Order ID: #{order.id}</p>

                    <div className="collection-info-card order-modal-info-card">
                        <div className="info-row">
                            <MapPin size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Shop</span>
                                <span className="info-value">{order.shopName}</span>
                            </div>
                        </div>
                        <div className="info-row">
                            <Clock size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Ordered On</span>
                                <span className="info-value">{new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr-section">
                        <div className="qr-container">
                            <div className="qr-mock">
                                <QrCode size={120} strokeWidth={1.5} />
                                <div className="qr-scan-line"></div>
                            </div>
                        </div>
                        <p className={`qr-instruction ${order.status === 'collected' ? 'qr-collected-text' : ''}`}>
                            {order.status === 'collected'
                                ? 'Order already collected'
                                : 'Show this QR to the vendor to collect'}
                        </p>
                    </div>

                    <div className="order-summary-mini">
                        <div className="summary-header">Items</div>
                        <div className="mini-item-list">
                            {order.cartItems.map((item, idx) => (
                                <div key={idx} className="mini-item">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mini-total">
                            <span>Total Paid</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="success-footer">
                    <button className="done-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
