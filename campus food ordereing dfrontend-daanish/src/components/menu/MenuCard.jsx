// import React from 'react';
// import '../../styles/menucss/MenuCard.css';


// const MenuCard = ({ id, name, price, image, category, onAdd }) => {
//   const isBeverage = category?.toLowerCase().includes('beverage');
//   return (
//     <div className="menu-card" onClick={() => onAdd(id)}>
//     <div className={`menu-card-image-container ${isBeverage ? 'beverage-mode' : ''}`}>        
//         <img src={image} alt={name} className="menu-card-image" />
//       </div>
      
//       <div className="menu-card-details">
//         <h3 className="menu-card-name">{name}</h3>
//         <span className="menu-card-price">₹{price}</span>
//       </div>
//     </div>
//   );
// };

// export default MenuCard;

import React from 'react';
import '../../styles/menucss/MenuCard.css';
import { Plus } from 'lucide-react'; // Optional: Use an icon if you have lucide-react, or just text

const MenuCard = ({ id, name, price, image, category, onAdd }) => {
  const isBeverage = category?.toLowerCase().includes('beverage');

  return (
    /* REMOVED onClick from here */
    <div className="menu-card"> 
      <div className={`menu-card-image-container ${isBeverage ? 'beverage-mode' : ''}`}>
        <img src={image} alt={name} className="menu-card-image" />
      </div>
      
      <div className="menu-card-details">
        <div className="text-group">
            <h3 className="menu-card-name">{name}</h3>
            <span className="menu-card-price">₹{price}</span>
        </div>

        {/* NEW: Dedicated Add Button */}
        <button className="add-btn" onClick={(e) => {
            e.stopPropagation(); // Prevents bubbling if you later add a card-click for details
            onAdd(id);
        }}>
            Add
        </button>
      </div>
    </div>
  );
};

export default MenuCard;