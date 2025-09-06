import React, { useCallback, memo } from 'react'
import PropTypes from 'prop-types'

const UbuntuApp = memo(function UbuntuApp(props) {
    const { isExternalApp, url, openApp, id, icon, name } = props;
    
    const handleOpenApp = useCallback(() => {
        if (isExternalApp && url) {
            window.open(url, "_blank", "noopener,noreferrer");
        } else if (openApp && id) {
            openApp(id);
        }
    }, [isExternalApp, url, openApp, id]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleOpenApp();
        }
    }, [handleOpenApp]);

    return (
        <div
            className="ubuntu-desktop-icon p-2 m-1 z-10 bg-transparent hover:bg-white hover:bg-opacity-20 focus:bg-white focus:bg-opacity-30 focus:outline-none border border-transparent hover:border-white hover:border-opacity-30 focus:border-white focus:border-opacity-50 rounded-lg select-none w-20 h-24 flex flex-col justify-center items-center text-center text-xs font-normal text-white relative cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-105"
            id={`app-${id}`}
            onDoubleClick={handleOpenApp}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`Open ${name}${isExternalApp ? ' (external link)' : ''}`}
        >
            <div className="relative">
                <img 
                    width="40" 
                    height="40" 
                    className="mb-1 w-10" 
                    src={icon} 
                    alt={`${name} application icon`}
                    loading="lazy"
                    onError={(e) => {
                        e.target.src = './themes/Yaru/system/application-default-icon.svg';
                    }}
                />
                {isExternalApp && (
                    <img 
                        src="./themes/Yaru/status/arrow-up-right.svg" 
                        alt="External Link Indicator" 
                        className="w-2.5 h-2.5 absolute -bottom-0.5 -right-0.5"
                    />
                )}
            </div>
            <span className="text-xs font-medium text-white drop-shadow-lg mt-1 leading-tight">{name}</span>
        </div>
    );
});

UbuntuApp.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    isExternalApp: PropTypes.bool,
    url: PropTypes.string,
    openApp: PropTypes.func,
};

UbuntuApp.defaultProps = {
    isExternalApp: false,
    url: null,
    openApp: null,
};

export default UbuntuApp
