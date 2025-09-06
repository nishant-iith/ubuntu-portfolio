import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

const Settings = React.memo(function Settings(props) {
    const wallpapers = {
        "wall-1": "./images/wallpapers/wall-1.webp",
        "wall-2": "./images/wallpapers/wall-2.webp",
        "wall-3": "./images/wallpapers/wall-3.webp",
        "wall-4": "./images/wallpapers/wall-4.webp",
        "wall-5": "./images/wallpapers/wall-5.webp",
        "wall-6": "./images/wallpapers/wall-6.webp",
        "wall-7": "./images/wallpapers/wall-7.webp",
        "wall-8": "./images/wallpapers/wall-8.webp",
    };

    const changeBackgroundImage = useCallback((wallpaperPath) => {
        if (props.changeBackgroundImage) {
            props.changeBackgroundImage(wallpaperPath);
        }
    }, [props.changeBackgroundImage]);

    const handleWallpaperSelect = useCallback((e) => {
        const path = e.currentTarget.dataset.path;
        if (path) {
            changeBackgroundImage(path);
        }
    }, [changeBackgroundImage]);

    return (
        <div className={"w-full flex-col flex-grow z-20 max-h-full overflow-y-auto windowMainScreen select-none bg-ub-cool-grey"}>
            <div className=" md:w-2/5 w-2/3 h-1/3 m-auto my-4" style={{ backgroundImage: `url(${wallpapers[props.currBgImgName]})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center" }}>
            </div>
            <div className="flex flex-wrap justify-center items-center border-t border-gray-900">
                {
                    Object.keys(wallpapers).map((name, index) => {
                        const isSelected = name === props.currBgImgName;
                        return (
                            <div 
                                key={index} 
                                tabIndex="0"
                                role="button"
                                aria-label={`Select wallpaper ${name}`}
                                onClick={handleWallpaperSelect}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        handleWallpaperSelect(e);
                                    }
                                }}
                                data-path={name} 
                                className={`${isSelected ? "border-yellow-700" : "border-transparent"} md:px-28 md:py-20 md:m-4 m-2 px-14 py-10 outline-none border-4 border-opacity-80 cursor-pointer hover:border-yellow-400 transition-colors`} 
                                style={{ 
                                    backgroundImage: `url(${wallpapers[name]})`, 
                                    backgroundSize: "cover", 
                                    backgroundRepeat: "no-repeat", 
                                    backgroundPosition: "center center" 
                                }}
                            />
                        );
                    })
                }
            </div>
        </div>
    );
});

Settings.propTypes = {
    currBgImgName: PropTypes.string.isRequired,
    changeBackgroundImage: PropTypes.func.isRequired,
};

Settings.displayName = 'Settings';

export { Settings };
export default Settings;

export const displaySettings = () => {
    return <Settings currBgImgName="wall-1" changeBackgroundImage={() => {}} />;
};
