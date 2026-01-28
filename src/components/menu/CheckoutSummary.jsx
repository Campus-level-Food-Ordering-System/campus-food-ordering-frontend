import React from 'react';
import { X, ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import '../../styles/menucss/CheckoutSummary.css';

const CheckoutSummary = ({ cartItems, shopName, onClose, onConfirm }) => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div className="checkout-overlay">
            <div className="checkout-modal">
                <div className="checkout-header">
                    <div className="header-title">
                        <ShoppingBag className="icon-blue" size={24} />
                        <h2>Checkout Summary</h2>
                    </div>
                    <button className="close-modal-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="checkout-body">
                    <div className="shop-info-summary">
                        <span className="label">Ordering from</span>
                        <h3 className="shop-name-summary">{shopName}</h3>
                    </div>

                    <div className="order-summary-list">
                        <div className="summary-section-title">Order Items</div>
                        {cartItems.map((item) => (
                            <div key={item.id} className="summary-item">
                                <div className="item-details">
                                    <span className="item-qty-badge">{item.qty}x</span>
                                    <span className="item-name-text">{item.name}</span>
                                </div>
                                <span className="item-total-price">₹{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bill-details">
                        <div className="summary-section-title">Bill Details</div>
                        <div className="bill-row total-amount">
                            <span>Total amount</span>
                            <span>₹{total.toFixed(2)}</span>
                        </div>
                        {/* <p className="no-tax-info">* All prices are inclusive of applicable charges.</p> */}
                    </div>

                    <div className="payment-method-selector">
                        <div className="summary-section-title">Payment Method</div>
                        <div className="payment-options-grid">
                            <div className="payment-option selected">
                                <CreditCard size={20} />
                                <span>Pay at Counter</span>
                                <ChevronRight size={16} className="chevron" />
                            </div>
                            <div className="payment-option disabled">
                                <span className="razorpay-logo">Razorpay</span>
                                <span>Pay Online (Coming Soon)</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="checkout-footer">
                    <button className="confirm-order-btn" onClick={onConfirm}>
                        Place Order • ₹{total.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
