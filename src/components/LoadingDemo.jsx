import React, { useState } from 'react';
import LoadingPlate from './common/LoadingPlate';
import OfflineMessage from './common/OfflineMessage';
import '../styles/pagescss/LoadingDemo.css';

const LoadingDemo = () => {
    const [showLoading, setShowLoading] = useState(true);
    const [showOffline, setShowOffline] = useState(false);

    const handleRetry = () => {
        setShowOffline(false);
    };

    // If offline mode is active, show offline message
    if (showOffline) {
        return <OfflineMessage onRetry={handleRetry} />;
    }

    return (
        <div className="loading-demo-page">
            <div className="demo-controls">
                <h1>Loading Animation Demo</h1>
                <div className="button-group">
                    <button
                        className="toggle-btn"
                        onClick={() => setShowLoading(!showLoading)}
                    >
                        {showLoading ? 'Hide' : 'Show'} Loading Animation
                    </button>
                    <button
                        className="offline-test-btn"
                        onClick={() => setShowOffline(true)}
                    >
                        🔴 Test Offline Mode
                    </button>
                </div>
            </div>

            {showLoading && (
                <div className="loading-demo-container">
                    <h3 className="animation-title">Plate Loading Animation</h3>
                    <LoadingPlate message="Loading delicious food..." />
                </div>
            )}

            {!showLoading && (
                <div className="content-loaded">
                    <h2>✅ Content Loaded!</h2>
                    <p>The loading animation should appear above when you click "Show"</p>
                </div>
            )}
        </div>
    );
};

export default LoadingDemo;
