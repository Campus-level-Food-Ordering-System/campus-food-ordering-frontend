import React from 'react';
import '../../styles/menucss/MenuCard.css';

const MenuCard = ({ id, name, price, image, onAdd }) => {
  return (
    <div className="menu-card" onClick={() => onAdd(id)}>
      <div className="menu-card-image-container">
        {/* The Black Circle Image */}
        <img src={image} alt={name} className="menu-card-image" />
      </div>
      
      <div className="menu-card-details">
        <h3 className="menu-card-name">{name}</h3>
        <span className="menu-card-price">₹{price}</span>
      </div>
    </div>
  );
};

export default MenuCard;