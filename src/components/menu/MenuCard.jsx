import React, { useState } from 'react';
import { Star, Heart, BadgeCheck, Bike, Clock, ShoppingCart } from 'lucide-react';
import '../../styles/menucss/MenuCard.css';

const MenuCard = ({ itemId, name, price, image, onAdd, description, category, rating = 4.5 }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div className="menu_card group">
      <div className="card_img_container">
        <img src={image} alt={name} className="card_img" />

        {/* <div className="rating_pill">
          <span className="rating_val">{rating}</span>
          <Star size={12} className="fill_yellow_400 text_yellow_400" fill="#facc15" stroke="none" />
          <span className="rating_count">(25+)</span>
        </div> */}

        <button className={`like_btn ${isLiked ? 'liked' : ''}`} onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}>
          <Heart size={18}
            className={`transition_colors ${isLiked ? 'text_orange_500' : 'text_gray_400'}`}
            fill={isLiked ? "#FF5E4D" : "white"}
            stroke={isLiked ? "#FF5E4D" : "#9ca3af"}
          />
        </button>
      </div>

      <div className="card_content">
        {/* Title & Price */}
        <div className="card_row">
          <h3 className="card_title">
            {name}
            <BadgeCheck size={20} className="text_white fill_badge_green" stroke="white" fill="#00BFA5" />
          </h3>
          <span className="card_price">₹{price}</span>
        </div>

        {/* <div className="meta_info">
          <div className="meta_group">
            <Bike size={18} className="text_branding_orange" />
            <span className="meta_text">free delivery</span>
          </div>
          <div className="meta_group">
            <Clock size={16} className="text_branding_orange" />
            <span className="meta_text">10-15 mins</span>
          </div>
        </div>

        <div className="tags_row">
          <span className="tag_chip">{category || 'Food'}</span>
          <span className="tag_chip">Popular</span>
          <span className="tag_chip">Fast</span>
        </div> */}

        {/* Description Mini (if available) - styled subtly */}
        {description && <p className="item_desc_mini">{description}</p>}

        {/* Add to Cart Button */}
        <button className="add_btn" onClick={(e) => {
          e.stopPropagation();
          onAdd(itemId);
        }}>
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default MenuCard;
