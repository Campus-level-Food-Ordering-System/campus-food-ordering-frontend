import React from 'react';
import '../styles/dashboardcss/ShopNameCard.css';

const ShopNameCard = ({ name, image, isOpen, onClick }) => {
  return (
    <div
      className={`shop-card ${!isOpen ? 'closed-shop' : ''}`}
      onClick={isOpen ? onClick : undefined}
    >
      <div className="shop-card-image-wrapper">
        <img src={image} alt={name} className="shop-card-image" draggable="false" />

        {/* Ribbon Badge Design */}
        {/* <div className={`shop-status-badge ${isOpen ? 'open' : 'closed'}`}>
          {isOpen ? 'Open' : 'Closed'}
        </div>
      </div> */}

        <div className="status-indicator-pill">
          <span className={`status-dot ${isOpen ? 'online' : 'offline'}`}></span>
          <span className="status-text">{isOpen ? 'LIVE' : 'CLOSED'}</span>
        </div>
      </div>

      <div className="shop-card-content">
        <h3 className="shop-name">{name}</h3>
      </div>
    </div>
  );
};

export default ShopNameCard;