import React from 'react';
import { X, ShoppingBag, CreditCard, ChevronRight, MapPin } from 'lucide-react';
import '../../styles/menucss/CheckoutSummary.css';

const CheckoutSummary = ({ cartItems, shopName, onClose, onConfirm }) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * 0;
    const total = subtotal + tax;

    return (
        <div className="checkout_overlay">
            <div className="checkout_modal">
                <div className="checkout_header">
                    <div className="header_title_group">
                        <ShoppingBag size={24} className="text_orange" />
                        <h2>Checkout Summary</h2>
                    </div>
                    <button className="close_modal_btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="checkout_body">
                    <div className="shop_info_summary">
                        <span className="label">Ordering from</span>
                        <h3 className="shop_name_summary">{shopName}</h3>
                    </div>

                    {/* <div className="checkout_section">
                        <div className="section_header">
                            <MapPin size={18} className="text_gray_400" />
                            <span>Delivery Address</span>
                        </div>
                        <div className="address_card">
                            <div className="address_title">Campus Center</div>
                            <div className="address_detail">Block A, Level 2, Room 204</div>
                        </div>
                    </div> */}

                    <div className="order_summary_list">
                        <div className="summary_section_title">Order Items</div>
                        <div className="summary_items_scroll">
                            {cartItems.map((item) => (
                                <div key={item.itemId} className="summary_item">
                                    <div className="item_info_group">
                                        <span className="item_qty_badge">{item.qty}x</span>
                                        <span className="item_name_text">{item.name}</span>
                                    </div>
                                    <span className="item_total_price">₹{(item.price * item.qty).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bill_details_card">
                        <div className="summary_section_title">Bill Details</div>
                        <div className="bill_rows_group">
                            {/* <div className="bill_row">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="bill_row">
                                <span>Tax (5%)</span>
                                <span>₹{tax.toFixed(2)}</span>
                            </div> */}
                            <div className="divider_dashed"></div>
                            <div className="bill_row total_amount">
                                <span>Total Paid</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="payment_method_selector">
                        <div className="summary_section_title">Payment Method</div>
                        <div className="payment_options_grid">
                            <div className="payment_option selected">
                                <CreditCard size={20} />
                                <span>Pay at Counter</span>
                                <ChevronRight size={16} className="chevron" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="checkout_footer">
                    <button className="confirm_order_btn" onClick={() => onConfirm('Immediate')}>
                        Place Order • ₹{total.toFixed(2)}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSummary;
