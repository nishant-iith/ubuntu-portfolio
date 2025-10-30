import React from 'react';

/**
 * Simple loading spinner component for Ubuntu portfolio
 * Matches the Ubuntu theme with orange accent color
 */
const LoadingSpinner = ({ message = "Loading Ubuntu..." }) => {
    return (
        <div className="fixed inset-0 bg-ub-drk-abrgn flex flex-col items-center justify-center z-50">
            {/* Ubuntu-style loading spinner */}
            <div className="relative mb-8">
                <div className="w-16 h-16 border-4 border-ub-orange/20 border-t-ub-orange rounded-full animate-spin"></div>
                {/* Inner ring for more sophisticated effect */}
                <div className="absolute inset-2 w-12 h-12 border-2 border-ub-orange/10 border-t-ub-orange/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>

            {/* Loading message */}
            <div className="text-center">
                <h2 className="text-2xl font-light text-white mb-2">Ubuntu Portfolio</h2>
                <p className="text-gray-400 text-sm animate-pulse">{message}</p>
            </div>

            {/* Loading dots animation */}
            <div className="flex space-x-2 mt-4">
                <div className="w-2 h-2 bg-ub-orange rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-ub-orange rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-ub-orange rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
};

export default LoadingSpinner;