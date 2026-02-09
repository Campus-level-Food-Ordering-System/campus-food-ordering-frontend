import React, { useState } from 'react';
import LoadingPlate from '../common/LoadingPlate';
import OfflineMessage from '../common/OfflineMessage';
import '../../styles/pagescss/LoadingDemo.css';

const LoadingDemo = () => {
    const [showLoading, setShowLoading] = useState(true);
    const [showOffline, setShowOffline] = useState(false);

    const handleRetry = () => {
        setShowOffline(false);
    };

    if (showOffline) {
        return <OfflineMessage onRetry={handleRetry} />;
    }

    return (
        <div className="loading_demo_page">
            <div className="demo_controls">
                <h1>Loading Animation Demo</h1>
                <div className="button_group">
                    <button
                        className="toggle_btn"
                        onClick={() => setShowLoading(!showLoading)}
                    >
                        {showLoading ? 'Hide' : 'Show'} Loading Animation
                    </button>
                    <button
                        className="offline_test_btn"
                        onClick={() => setShowOffline(true)}
                    >
                        🔴 Test Offline Mode
                    </button>
                </div>
            </div>

            {showLoading && (
                <div className="loading_demo_container">
                    <h3 className="animation_title">Plate Loading Animation</h3>
                    <LoadingPlate message="Loading delicious food..." />
                </div>
            )}

            {!showLoading && (
                <div className="content_loaded">
                    <h2>✅ Content Loaded!</h2>
                    <p>The loading animation should appear above when you click "Show"</p>
                </div>
            )}
        </div>
    );
};

export default LoadingDemo;
