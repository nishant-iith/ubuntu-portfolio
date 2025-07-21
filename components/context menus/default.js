import React, { useRef, useEffect } from 'react';


// Use forwardRef for compatibility with onClickOutside
function MenuComponent({ active, style, onClose }) {
    const ref = useRef(null);

    useEffect(() => {
        if (!active) return;
        function handleClick(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                // Hide menu if click outside
                if (typeof onClose === 'function') onClose();
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [active, onClose]);

    return (
        <div ref={ref} id="default-menu" className={(active ? " block " : " hidden ") + " cursor-default w-52 context-menu-bg border text-left border-gray-900 rounded text-white py-4 absolute z-50 text-sm"} style={style}>
            <a rel="noreferrer noopener" href="https://github.com/nishant-iith/nishant-iith.github.io" target="_blank" className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">🌟</span> <span className="ml-2">Star this Project</span>
            </a>
            <a rel="noreferrer noopener" href="https://github.com/nishant-iith/nishant-iith.github.io/issues" target="_blank" className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">❗</span> <span className="ml-2">Report bugs</span>
            </a>
            <Devider />
            <a rel="noreferrer noopener" href="https://www.linkedin.com/in/nishant-iith/" target="_blank" className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">🙋‍♂️</span> <span className="ml-2">Follow on <strong>Linkedin</strong></span>
            </a>
            <a rel="noreferrer noopener" href="https://github.com/nishant-iith" target="_blank" className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">🤝</span> <span className="ml-2">Follow on <strong>Github</strong></span>
            </a>
            <a rel="noreferrer noopener" href="mailto:iith.nishant@gmail.com" target="_blank" className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">📥</span> <span className="ml-2">Contact Me</span>
            </a>
            <Devider />
            <div onClick={() => { localStorage.clear(); window.location.reload() }} className="w-full block cursor-default py-0.5 hover:bg-ub-warm-grey hover:bg-opacity-20 mb-1.5">
                <span className="ml-5">🧹</span> <span className="ml-2">Reset Ubuntu</span>
            </div>
        </div>
    );
}

function Devider() {
    return (
        <div className="flex justify-center w-full">
            <div className=" border-t border-gray-900 py-1 w-2/5"></div>
        </div>
    );
}

export default MenuComponent;
