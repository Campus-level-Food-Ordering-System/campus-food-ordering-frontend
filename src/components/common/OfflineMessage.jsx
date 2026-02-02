import React from 'react';
import './OfflineMessage.css';

const OfflineMessage = ({ onRetry }) => {
    return (
        <div className="offline_container">
            <div className="offline_card">
                {/* WiFi Off Icon */}
                <div className="wifi_icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 9L5 13L9 9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <path d="M12 12L16 16L20 12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                        <line x1="2" y1="22" x2="22" y2="2" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </div>

                {/* Message */}
                <h2 className="offline_title">No Internet Connection</h2>
                <p className="offline_message">
                    Oops! It seems you're offline. Please check your internet connection and try again.
                </p>

                {/* Status Indicators */}
                <div className="offline_checklist">
                    <div className="check_item">
                        <span className="check_icon">📶</span>
                        <span>Check your WiFi or mobile data</span>
                    </div>
                    <div className="check_item">
                        <span className="check_icon">🔌</span>
                        <span>Verify router connection</span>
                    </div>
                    <div className="check_item">
                        <span className="check_icon">🔄</span>
                        <span>Try refreshing the page</span>
                    </div>
                </div>

                {/* Retry Button */}
                <button className="retry_btn" onClick={onRetry}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.8273 3 17.35 4.30367 19 6.34267" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        <path d="M21 3V7H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Retry Connection
                </button>

                {/* Decorative Elements */}
                <div className="offline_decoration">
                    <div className="cloud cloud_1">☁️</div>
                    <div className="cloud cloud_2">☁️</div>
                    <div className="cloud cloud_3">☁️</div>
                </div>
            </div>
        </div>
    );
};

export default OfflineMessage;
