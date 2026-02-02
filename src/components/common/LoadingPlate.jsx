import React from 'react';
import './LoadingPlate.css';

const LoadingPlate = ({ message = 'Loading delicious food...' }) => {
    return (
        <div className="loading_plate_container">
            <div className="plate_wrapper">
                {/* Plate */}
                <div className="plate">
                    <div className="plate_inner"></div>
                </div>

                {/* Food items appearing on plate */}
                <div className="food_items">
                    <div className="food_item food_1">🍚</div> {/* Fried Rice */}
                    <div className="food_item food_2">🍜</div> {/* Noodles */}
                    <div className="food_item food_3">🫓</div> {/* Parota */}
                    <div className="food_item food_4">🥞</div> {/* Dosa */}
                </div>

                {/* Utensils */}
                <div className="utensils">
                    <div className="fork">🍴</div>
                    <div className="knife">🔪</div>
                </div>
            </div>

            {/* Loading text */}
            <p className="loading_text">{message}</p>

            {/* Loading dots */}
            <div className="loading_dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default LoadingPlate;
