import React, { useState } from 'react'
import DockApp from '../base/dock_app';

/**
 * Renders the favorite apps in the bottom dock
 */
let renderApps = (props) => {
    let dockAppsJsx = [];
    props.apps.forEach((app, index) => {
        if (props.favourite_apps[app.id] === false) return;
        dockAppsJsx.push(
            <DockApp
                key={index}
                id={app.id}
                title={app.title}
                icon={app.icon}
                isClose={props.closed_windows}
                isFocus={props.focused_windows}
                openApp={props.openAppByAppId}
                isMinimized={props.isMinimized}
                openFromMinimised={props.openFromMinimised}
                onReorder={(draggedId, targetId) => {
                    console.log(`Reorder: ${draggedId} -> ${targetId}`);
                    // This would need to be implemented in the parent component
                    // to actually reorder the apps in the dock
                }}
            />
        );
    });
    return dockAppsJsx;
}

/**
 * Ubuntu-style bottom dock component
 */
export default function BottomDock(props) {
    return (
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 z-40 mb-2">
            <div className="flex items-center justify-center px-3 py-2 bg-ub-panel bg-opacity-90 backdrop-blur-md rounded-2xl shadow-ubuntu-lg border border-gray-600 border-opacity-30">
                {/* App Grid (Show Applications) - Always leftmost */}
                <ShowApplications showApps={props.showAllApps} />

                {/* Separator line */}
                <div className="w-px h-8 bg-gray-500 bg-opacity-50 mx-2"></div>

                {/* Render favorite apps */}
                <div className="flex items-center space-x-1">
                    {Object.keys(props.closed_windows).length !== 0 ? renderApps(props) : null}
                </div>

                {/* Separator line before trash */}
                <div className="w-px h-8 bg-gray-500 bg-opacity-50 mx-2"></div>

                {/* Trash */}
                <TrashIcon />
            </div>
        </div>
    )
}

/**
 * Show Applications button (App Grid)
 */
export function ShowApplications(props) {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative">
            <div
                className="w-12 h-12 rounded-lg hover:bg-white hover:bg-opacity-10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={props.showApps}
            >
                <img
                    width="28px"
                    height="28px"
                    className="w-7 h-7"
                    src="./themes/Yaru/system/view-app-grid-symbolic.svg"
                    alt="Show Applications"
                />
            </div>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-ub-cool-grey bg-opacity-90 text-white text-xs rounded whitespace-nowrap z-50">
                    Show Applications
                </div>
            )}
        </div>
    );
}

/**
 * Trash icon for the dock
 */
export function TrashIcon() {
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative">
            <div
                className="w-12 h-12 rounded-lg hover:bg-white hover:bg-opacity-10 flex items-center justify-center transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => console.log('Trash clicked')}
            >
                <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-7 h-7 text-gray-300"
                >
                    <polyline points="3,6 5,6 21,6"></polyline>
                    <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    <line x1="10" y1="11" x2="10" y2="17"></line>
                    <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
            </div>

            {/* Tooltip */}
            {showTooltip && (
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-ub-cool-grey bg-opacity-90 text-white text-xs rounded whitespace-nowrap z-50">
                    Trash
                </div>
            )}
        </div>
    );
}