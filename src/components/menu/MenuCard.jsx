import React from 'react';
import '../../styles/menucss/MenuCard.css';

// Using props compatible with A's data mapping above

const MenuCard = ({ id, itemId, name, price, image, category, onAdd }) => {

  const finalId = id || itemId;
  const isBeverage = category?.toLowerCase().includes('beverage') || 
                     category?.toLowerCase().includes('drink');

  return (
    <div className="menu-card"> 
      <div className={`menu-card-image-container ${isBeverage ? 'beverage-mode' : ''}`}>
        <img src={image} alt={name} className="menu-card-image" />
      </div>
      
      <div className="menu-card-details">
        <div className="text-group">
            <h3 className="menu-card-name">{name}</h3>
            <span className="menu-card-price">₹{price}</span>
        </div>

        <button className="add-btn" onClick={(e) => {
            e.stopPropagation();
            onAdd(finalId);
        }}>
            Add
        </button>
      </div>
    </div>
  );
};

export default MenuCard;