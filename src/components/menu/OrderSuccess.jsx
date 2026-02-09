import React, { useMemo } from 'react';
import { CheckCircle2, QrCode, Clock, MapPin, X } from 'lucide-react';
import '../../styles/menucss/OrderSuccess.css';

const OrderSuccess = ({ orderDetails, shopName, onClose }) => {
    const { cartItems, total, orderId = Math.random().toString(36).substr(2, 9).toUpperCase() } = orderDetails;

    return (
        <div className="success_overlay">
            <div className="success_modal">
                <button className="close_success_btn" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="success_body">
                    {/* Enhanced Success Animation */}
                    <div className="success_animation_wrapper">
                        <div className="check_ring"></div>
                        <div className="checkmark_container">
                            <svg className="checkmark_svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                                <circle className="checkmark_circle_bg" cx="26" cy="26" r="25" fill="none" />
                                <path className="checkmark_check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                            </svg>
                        </div>
                    </div>

                    <h2 className="success_title">Order Placed!</h2>
                    <p className="order_id_text">Order ID: #{orderId}</p>

                    <div className="collection_info_card">
                        <div className="info_row">
                            <MapPin size={20} className="info_icon" />
                            <div className="info_text_group">
                                <span className="info_label">Pickup Point</span>
                                <span className="info_value">{shopName}</span>
                            </div>
                        </div>
                    </div>

                    <div className="qr_section">
                        <div className="qr_container">
                            <div className="qr_mock">
                                <QrCode size={110} strokeWidth={1.5} />
                                <div className="qr_scan_line"></div>
                            </div>
                        </div>
                        <p className="qr_instruction">Show this QR to the vendor to collect your order</p>
                    </div>

                    <div className="order_summary_mini">
                        <div className="summary_header">Items Summary</div>
                        <div className="mini_item_list">
                            {cartItems.map((item, idx) => (
                                <div key={idx} className="mini_item">
                                    <span>{item.qty}x {item.name}</span>
                                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mini_total">
                            <span>Amount Paid</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="success_footer">
                    <button className="done_btn" onClick={onClose}>
                        Back to Menu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
