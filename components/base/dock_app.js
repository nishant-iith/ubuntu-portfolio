import React, { Component } from "react";

/**
 * Individual app component for the bottom dock
 */
export class DockApp extends Component {
    constructor() {
        super();
        this.id = null;
        this.state = {
            showTooltip: false,
            scaleImage: false,
            isDragging: false,
        };
    }

    componentDidMount() {
        this.id = this.props.id;
    }

    /**
     * Scale animation when app is already open but dock icon is clicked
     */
    scaleImage = () => {
        setTimeout(() => {
            this.setState({ scaleImage: false });
        }, 300);
        this.setState({ scaleImage: true });
    }

    /**
     * Handle opening/focusing the app
     */
    openApp = () => {
        if (!this.props.isMinimized[this.id] && this.props.isClose[this.id]) {
            this.scaleImage();
        }
        this.props.openApp(this.id);
        this.setState({ showTooltip: false });
    };

    /**
     * Handle drag start
     */
    handleDragStart = (e) => {
        this.setState({ isDragging: true, showTooltip: false });
        e.dataTransfer.setData('text/plain', this.id);
        e.dataTransfer.effectAllowed = 'move';
    };

    /**
     * Handle drag end
     */
    handleDragEnd = () => {
        this.setState({ isDragging: false });
    };

    /**
     * Handle drag over (for drop target)
     */
    handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    /**
     * Handle drop
     */
    handleDrop = (e) => {
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        if (draggedId !== this.id && this.props.onReorder) {
            this.props.onReorder(draggedId, this.id);
        }
    };

    render() {
        const isOpen = this.props.isClose[this.id] === false;
        const isFocused = this.props.isFocus[this.id];

        return (
            <div className="relative">
                <div
                    tabIndex="0"
                    draggable="true"
                    onClick={this.openApp}
                    onDragStart={this.handleDragStart}
                    onDragEnd={this.handleDragEnd}
                    onDragOver={this.handleDragOver}
                    onDrop={this.handleDrop}
                    onMouseEnter={() => !this.state.isDragging && this.setState({ showTooltip: true })}
                    onMouseLeave={() => this.setState({ showTooltip: false })}
                    className={`
                        w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer outline-none
                        transition-all duration-200 hover:bg-white hover:bg-opacity-10
                        ${isOpen && isFocused ? 'bg-white bg-opacity-15' : ''}
                        ${this.state.scaleImage ? 'scale-110' : ''}
                        ${this.state.isDragging ? 'opacity-50 scale-95' : ''}
                    `}
                    id={"dock-" + this.props.id}
                >
                    {/* App Icon */}
                    <img
                        width="32px"
                        height="32px"
                        className="w-8 h-8 pointer-events-none"
                        src={this.props.icon}
                        alt={this.props.title}
                        draggable="false"
                    />

                    {/* Running indicator (dot below icon) */}
                    {isOpen && (
                        <div className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                    )}
                </div>

                {/* Tooltip */}
                {this.state.showTooltip && !this.state.isDragging && (
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-ub-cool-grey bg-opacity-90 text-white text-xs rounded whitespace-nowrap z-50">
                        {this.props.title}
                    </div>
                )}
            </div>
        );
    }
}

export default DockApp;