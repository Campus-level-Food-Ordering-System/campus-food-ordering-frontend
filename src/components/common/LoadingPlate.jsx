import React from 'react';
import './LoadingPlate.css';

const LoadingPlate = ({ message = 'Loading delicious food...' }) => {
    return (
        <div className="loading-plate-container">
            <div className="plate-wrapper">
                {/* Plate */}
                <div className="plate">
                    <div className="plate-inner"></div>
                </div>

                {/* Food items appearing on plate */}
                <div className="food-items">
                    <div className="food-item food-1">🍚</div> {/* Fried Rice */}
                    <div className="food-item food-2">🍜</div> {/* Noodles */}
                    <div className="food-item food-3">🫓</div> {/* Parota */}
                    <div className="food-item food-4">🥞</div> {/* Dosa */}
                </div>

                {/* Utensils */}
                <div className="utensils">
                    <div className="fork">🍴</div>
                    <div className="knife">🔪</div>
                </div>
            </div>

            {/* Loading text */}
            <p className="loading-text">{message}</p>

            {/* Loading dots */}
            <div className="loading-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    );
};

export default LoadingPlate;
