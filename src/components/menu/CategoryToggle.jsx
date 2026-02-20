import React from 'react';
import '../../styles/menucss/CategoryToggle.css'; // Make sure this points to where D's slider CSS is

const CategoryToggle = ({ activeCategory, setCategory, categories = [] }) => {
  // Fallback to D's hardcoded list just in case A's array is empty
  const displayCategories = categories.length > 0 
    ? categories 
    : [ { id: 'food', label: 'Food' }, { id: 'beverages', label: 'Beverages' } ];

  // Find the index to calculate how far the background should slide
  const activeIndex = displayCategories.findIndex(cat => cat.id === activeCategory);

  return (
    <div className="category-toggle-container">
      <div className="category-pill">
        {displayCategories.map((cat) => (
            <button 
              key={cat.id}
              className={`toggle-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
        ))}
        
        {/* The sliding background effect - dynamically calculated! */}
        <div 
            className="slider-bg" 
            style={{ 
                transform: `translateX(${Math.max(0, activeIndex) * 100}%)`,
            }} 
        />
      </div>
    </div>
  );
};

export default CategoryToggle;