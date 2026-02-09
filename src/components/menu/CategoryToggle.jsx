import React from 'react';
import '../../styles/menucss/CategoryToggle.css';

const EMOJI_MAP = {
  food: '🍕',
  pizza: '🍕',
  burger: '🍔',
  mexican: '🌮',
  asian: '🍱',
  icecream: '🍦',
  beverages: '🥤',
  beverage: '🥤',
  drinks: '🥤',
  snacks: '🍿',
  desserts: '🍰'
};

const CategoryToggle = ({ activeCategory, setCategory, categories = [] }) => {
  return (
    <>
      {categories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const emoji = EMOJI_MAP[cat.id.toLowerCase()] || '🍽️';
        return (
          <button
            key={cat.id}
            className={`category_btn ${isActive ? 'active' : 'inactive'}`}
            onClick={() => setCategory(cat.id)}
          >
            <div className="cat_inner">
              <span className="cat_emoji">{emoji}</span>
            </div>
            <span className="cat_text">{cat.label}</span>
          </button>
        );
      })}
    </>
  );
};

export default CategoryToggle;
