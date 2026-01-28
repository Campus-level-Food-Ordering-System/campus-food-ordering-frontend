import React, { useMemo } from 'react';
import { CheckCircle2, QrCode, Clock, MapPin, X } from 'lucide-react';
import '../../styles/menucss/OrderSuccess.css';

const OrderSuccess = ({ orderDetails, shopName, onClose }) => {
    const { cartItems, total, orderId = Math.random().toString(36).substr(2, 9).toUpperCase() } = orderDetails;

    // Collection Time Logic
    const collectionTime = useMemo(() => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMin = now.getMinutes();
        const currentTimeInMins = currentHour * 60 + currentMin;

        // Break times in minutes from midnight
        const breaks = [
            { label: '11:10 AM', mins: 11 * 60 + 10 },
            { label: '12:15 PM', mins: 12 * 60 + 15 },
            { label: '04:30 PM', mins: 16 * 60 + 30 }
        ];

        // Find the next break
        const nextBreak = breaks.find(b => b.mins > currentTimeInMins);

        // If all breaks passed for today, or it's very late, use the first break of tomorrow (simulated as today's first break for demo)
        return nextBreak ? nextBreak.label : breaks[0].label;
    }, []);

    return (
        <div className="success-overlay">
            <div className="success-modal">
                <button className="close-success-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="success-body">
                    {/* Enhanced Success Animation */}
                    <div className="success-animation-wrapper">
                        <div className="check-ring"></div>
                        <div className="checkmark-container">
                            <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark-circle-bg" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                        <div className="confetti-particles">
                            {[...Array(12)].map((_, i) => <div key={i} className={`particle p-${i + 1}`}></div>)}
                        </div>
                    </div>

                    <h2 className="success-title">Order Placed!</h2>
                    <p className="order-id-text">Order ID: #{orderId}</p>

                    <div className="collection-info-card">
                        <div className="info-row">
                            <Clock size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Collect by</span>
                                <span className="info-value">{collectionTime}</span>
                            </div>
                        </div>
                        <div className="info-row">
                            <MapPin size={20} className="info-icon" />
                            <div>
                                <span className="info-label">Pickup Point</span>
                                <span className="info-value">{shopName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr-section">
                        <div className="qr-container">
                            {/* Decorative QR framework since we don't have a library yet */}
                            <div className="qr-mock">
                                <QrCode size={110} strokeWidth={1.5} />
                                <div className="qr-scan-line"></div>
                            </div>
                        </div>
                        <p className="qr-instruction">Show this QR to the vendor to collect your order</p>
                    </div>

                    <div className="order-summary-mini">
                        <div className="summary-header">Items Summary</div>
                        <div className="mini-item-list">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="mini-item">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mini-total">
                            <span>Amount Paid</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="success-footer">
                    <button className="done-btn" onClick={onClose}>
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
