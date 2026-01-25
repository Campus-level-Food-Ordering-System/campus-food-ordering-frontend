import React from 'react';
import '../../styles/menucss/MenuDashboard.css'; // Shared styles

const CategoryToggle = ({ activeCategory, setCategory }) => {
  return (
    <div className="category-toggle-container">
      <div className="category-pill">
        <button
          className={`gaaaa-toggle-btn ${activeCategory === 'food' ? 'active' : ''}`}
          onClick={() => setCategory('food')}
        >
          Food
        </button>
        <button
          className={`gaaaa-toggle-btn ${activeCategory === 'beverages' ? 'active' : ''}`}
          onClick={() => setCategory('beverages')}
        >
          Beverages
        </button>
        {/* The sliding background effect */}
        <div className={`slider-bg ${activeCategory}`} />
      </div>
    </div>
  );
};

export default CategoryToggle;