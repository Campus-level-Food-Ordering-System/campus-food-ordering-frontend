import React from 'react';
import '../../styles/usercss/ShopNameCard.css';

const ShopNameCard = ({ name, image, isOpen, isActive, onClick }) => {
  const isAvailable = isOpen && isActive;

  return (
    <div
      className={`shop_card ${!isAvailable ? 'closed_shop' : ''} ${!isActive ? 'admin-disabled' : ''}`}
      onClick={isAvailable ? onClick : undefined}
    >
      <div className="shop_card_image_wrapper">
        <img src={image} alt={name} className="shop_card_image" draggable="false" />

        <div className="status_indicator_pill">
          <span className={`status_dot ${isAvailable ? 'online' : 'offline'}`}></span>
          <span className="status_text">
            {!isActive ? 'MAINTENANCE' : (isOpen ? 'LIVE' : 'CLOSED')}
          </span>
        </div>
      </div>

      <div className="shop_card_content">
        <h3 className="shop_name">{name}</h3>
      </div>
    </div>
  );
};

export default ShopNameCard;
