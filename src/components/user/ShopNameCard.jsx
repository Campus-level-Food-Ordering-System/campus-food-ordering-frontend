import React from 'react';
import '../../styles/usercss/ShopNameCard.css';

const ShopNameCard = ({ name, image, isOpen, isActive, onClick }) => {
  const isAvailable = isOpen && isActive;

  return (
    <div
      className={`shop-card ${!isAvailable ? 'closed-shop' : ''} ${!isActive ? 'admin-disabled' : ''}`}
      onClick={isAvailable ? onClick : undefined}
    >
      <div className="shop-card-image-wrapper">
        <img src={image} alt={name} className="shop-card-image" draggable="false" />

        <div className="status-indicator-pill">
          <span className={`status-dot ${isAvailable ? 'online' : 'offline'}`}></span>
          <span className="status-text">
            {!isActive ? 'MAINTENANCE' : (isOpen ? 'LIVE' : 'CLOSED')}
          </span>
        </div>
      </div>

      <div className="shop-card-content">
        <h3 className="shop-name">{name}</h3>
      </div>
    </div>
  );
};

export default ShopNameCard;
