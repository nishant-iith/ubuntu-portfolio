import React from 'react'

function BootingScreen(props) {
    // Modern, classy glassmorphic booting screen with official Ubuntu logo (white)
    return (
        <div
            style={(props.visible || props.isShutDown ? { zIndex: "100" } : { zIndex: "-20" })}
            className={
                (props.visible || props.isShutDown ? " visible opacity-100" : " invisible opacity-0 ") +
                " absolute duration-500 select-none flex flex-col justify-center items-center top-0 right-0 overflow-hidden m-0 p-0 h-screen w-screen"
            }
        >
            {/* Glassmorphic background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#23243a] via-[#2e335a] to-[#1b1c2a] bg-opacity-90 backdrop-blur-2xl z-10"></div>
            <div className="relative z-20 flex flex-col items-center justify-center w-full h-full">
                {/* Official Ubuntu orange logo */}
                <div className="flex flex-col items-center">
                    <div className="rounded-full bg-white bg-opacity-10 p-8 shadow-lg backdrop-blur-md">
                        <img
                            src="/themes/Yaru/status/cof_orange_hex.svg"
                            alt="Ubuntu Logo"
                            className="w-24 h-24 md:w-32 md:h-32"
                            style={{ filter: "brightness(1.2)" }}
                        />
                    </div>
                    <div className="mt-8 text-4xl md:text-5xl font-extrabold text-white tracking-wider drop-shadow-lg font-[Ubuntu,sans-serif]">
                        <span className="text-white">Ubuntu</span>
                        <span className="ml-2 text-[#8f8fff] font-bold">Portfolio</span>
                    </div>
                </div>
                {/* Modern animated dot loader */}
                <div className="mt-14 flex flex-col items-center">
                    <div className="flex space-x-2">
                        <span className="dot-loader"></span>
                        <span className="dot-loader"></span>
                        <span className="dot-loader"></span>
                    </div>
                    <div className="mt-6 text-base text-[#c7c7d9] tracking-wide font-medium font-[Ubuntu,sans-serif]">
                        {props.isShutDown ? (
                            <span>
                                Powered Off &mdash; <span className="underline cursor-pointer text-[#8f8fff] hover:text-[#b7b7ff]" onClick={props.turnOn}>Turn On</span>
                            </span>
                        ) : (
                            <span>Waking up your workspace...</span>
                        )}
                    </div>
                </div>
            </div>
            {/* Custom CSS for animation */}
            <style jsx>{`
                .dot-loader {
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin: 0 4px;
                    background: #8f8fff;
                    border-radius: 50%;
                    opacity: 0.7;
                    animation: dot-bounce 1.2s infinite cubic-bezier(.68,-0.55,.27,1.55);
                }
                .dot-loader:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .dot-loader:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes dot-bounce {
                    0%, 80%, 100% { transform: translateY(0);}
                    40% { transform: translateY(-16px);}
                }
            `}</style>
        </div>
    )
}

export default BootingScreen
