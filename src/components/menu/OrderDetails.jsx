import React from 'react';
import { Trash2, Plus, Minus, X } from 'lucide-react';
import '../../styles/menucss/OrderDetails.css';

const OrderDetails = ({ cartItems, onUpdateQty, onRemove, onClose, onCheckout, isMobile }) => {
  const total = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="order-details-panel">
      <div className="order-header">
        <h2>My Orders</h2>
        {/* Close button only shows on mobile */}
        {isMobile && (
          <button className="gaaaa-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>

      <div className="order-list">
        {cartItems.length === 0 ? (
          <div className="empty-state">No items yet</div>
        ) : (
          cartItems.map((item) => (
            <div key={item.id} className="order-item">
              <span className="item-name">{item.name}</span>

              <div className="qty-control">
                <button onClick={() => onUpdateQty(item.id, -1)} disabled={item.qty <= 1}>
                  <Minus size={12} />
                </button>
                <span className="qty-value">{item.qty}</span>
                <button onClick={() => onUpdateQty(item.id, 1)}>
                  <Plus size={12} />
                </button>
              </div>

              <span className="item-price">₹{(item.price * item.qty).toFixed(2)}</span>

              <button className="gaaaa-delete-btn" onClick={() => onRemove(item.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="order-footer">
        <div className="total-row">
          <span>Total</span>
          <span className="total-price">₹{total.toFixed(2)}</span>
        </div>
        <button
          className="gaaaa-checkout-btn"
          disabled={cartItems.length === 0}
          onClick={onCheckout}
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default OrderDetails;