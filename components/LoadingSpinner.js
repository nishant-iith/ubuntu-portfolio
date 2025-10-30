import React from 'react';

/**
 * Simple loading screen for Ubuntu portfolio
 * Shows only the Ubuntu logo for 0.5 seconds
 */
const LoadingSpinner = ({ message = "Loading Ubuntu..." }) => {
    return (
        <div className="fixed inset-0 bg-ub-drk-abrgn flex flex-col items-center justify-center z-50">
            {/* Ubuntu logo and title - Only this one screen */}
            <div className="text-center">
                <h1 className="text-4xl font-light text-white mb-2">Ubuntu</h1>
                <p className="text-gray-300 text-lg">Portfolio</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;