import React from 'react';
import { ShoppingCart, Settings, X, ChevronLeft, ChevronRight, MapPin, Clock } from 'lucide-react';
import '../../styles/menucss/OrderDetails.css';

const OrderDetails = ({ cartItems, onUpdateQty, onRemove, onClose, onCheckout, isMobile, shopName, isCollapsed, toggleCollapse }) => {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discount = 0; // Mock
  const tax = subtotal * 0.05; // Mock 5% tax
  const total = subtotal - discount + tax;

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className={`order_sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar_top_icons">
        <div className="sidebar_top_left">
          <button className="sidebar_collapse_btn" onClick={toggleCollapse} title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}>
            {isCollapsed ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
          {!isCollapsed ? (
            <div className="sidebar_orders_title">My Orders</div>
          ) : (
            <div className="sidebar_collapsed_label">
              <span className="vertical_text">MY ORDERS</span>
              <span className="collapsed_count">{totalItems}</span>
            </div>
          )}
        </div>
        {!isCollapsed && (
          <button className="sidebar_close_btn" onClick={onClose} aria-label="Close sidebar">
            <X size={20} />
          </button>
        )}
      </div>

      <div className="sidebar_content_wrapper">
        {/* Info row */}
        {/* {!isCollapsed && (
          <div className="sidebar_info_container">
            <div className="sidebar_info_item">
              <span className="sidebar_info_label">Address</span>
              <div className="sidebar_info_group">
                <MapPin size={14} className="text_orange" />
                <span className="sidebar_info_value">Campus Center</span>
              </div>
            </div>
            <div className="sidebar_info_item">
              <span className="sidebar_info_label">Estimate</span>
              <div className="sidebar_info_group">
                <Clock size={14} className="text_orange" />
                <span className="sidebar_info_value">15-20 mins</span>
              </div>
            </div>
          </div>
        )} */}

        {/* Order Items List */}
        <div className="sidebar_order_list">
          {cartItems.length === 0 ? (
            <div className="sidebar_empty_state">No items in cart</div>
          ) : (
            cartItems.map((item) => (
              <div key={item.itemId} className="sidebar_order_item">
                <div className="sidebar_item_top">
                  <img src={item.image} alt={item.name} className="sidebar_item_img" />
                  <div className="sidebar_item_details">
                    <span className="sidebar_item_name">{item.name}</span>
                    <div className="sidebar_qty_control">
                      <button className="sidebar_qty_btn" onClick={() => onUpdateQty(item.itemId, -1)}>-</button>
                      <span className="sidebar_qty_val">{item.qty}</span>
                      <button className="sidebar_qty_btn" onClick={() => onUpdateQty(item.itemId, 1)}>+</button>
                    </div>
                  </div>
                  <span className="sidebar_item_price">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        <div className="sidebar_summary_card">
          <div className="sidebar_summary_row">
            <span className="sidebar_summary_label">Subtotal</span>
            <span className="sidebar_summary_val">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="sidebar_summary_row">
            <span className="sidebar_summary_label">Discount</span>
            <span className="sidebar_summary_val">-₹{discount.toFixed(2)}</span>
          </div>
          <div className="sidebar_summary_row">
            <span className="sidebar_summary_label">Tax (5%)</span>
            <span className="sidebar_summary_val">₹{tax.toFixed(2)}</span>
          </div>
          <div className="sidebar_divider"></div>
          <div className="sidebar_total_row">
            <span className="sidebar_total_label">Total</span>
            <span className="sidebar_total_val">₹{total.toFixed(2)}</span>
          </div>
        </div>

        {/* Button */}
        <button
          className="sidebar_checkout_btn"
          disabled={cartItems.length === 0}
          onClick={onCheckout}
        >
          Continue to payment
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;
