import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BootingScreen from './screen/booting_screen';
import Desktop from './screen/desktop';
import LockScreen from './screen/lock_screen';
import Navbar from './screen/navbar';
import ReactGA from 'react-ga4';

export default class Ubuntu extends Component {
	constructor() {
		super();
		this.state = {
			screen_locked: false,
			bg_image_name: 'wall-1', // changed default to a valid wallpaper
			booting_screen: true,
			shutDownScreen: false,
			contextMenuVisible: false, // New state for context menu visibility
			contextMenuPosition: { x: 0, y: 0 }, // New state for context menu position
			showPowerDialog: false // Show shutdown/restart/log out dialog
		};
	}

	componentDidMount() {
		this.getLocalData();
		document.addEventListener('click', this.handleGlobalClick);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.handleGlobalClick);
	}

	handleGlobalClick = (event) => {
		// Only hide if context menu is open and click is outside the menu
		if (this.state.contextMenuVisible) {
			// If the click is inside the context menu, do nothing
			const menu = document.getElementById('default-menu');
			if (menu && menu.contains(event.target)) return;
			this.hideContextMenu();
		}
	}

	setTimeOutBootScreen = () => {
		setTimeout(() => {
			this.setState({ booting_screen: false });
		}, 4000); // increased for longer Ubuntu boot feel
	};

	getLocalData = () => {
		// Get Previously selected Background Image
		let bg_image_name = localStorage.getItem('bg-image');
		const validWallpapers = [
			'wall-1', 'wall-2', 'wall-3', 'wall-4', 'wall-5', 'wall-6', 'wall-7', 'wall-8'
		];
		if (bg_image_name && validWallpapers.includes(bg_image_name)) {
			this.setState({ bg_image_name });
		} else {
			this.setState({ bg_image_name: 'wall-1' });
			localStorage.setItem('bg-image', 'wall-1');
		}

		let booting_screen = localStorage.getItem('booting_screen');
		if (booting_screen !== null && booting_screen !== undefined) {
			// user has visited site before
			this.setState({ booting_screen: false });
		} else {
			// user is visiting site for the first time
			localStorage.setItem('booting_screen', false);
			this.setTimeOutBootScreen();
		}

		// get shutdown state
		let shut_down = localStorage.getItem('shut-down');
		if (shut_down !== null && shut_down !== undefined && shut_down === 'true') this.shutDown();
		else {
			// Get previous lock screen state
			let screen_locked = localStorage.getItem('screen-locked');
			if (screen_locked !== null && screen_locked !== undefined) {
				this.setState({ screen_locked: screen_locked === 'true' ? true : false });
			}
		}
	};

	lockScreen = () => {
		// google analytics - only send if tracking ID exists
		const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
		if (TRACKING_ID) {
			ReactGA.send({ hitType: "pageview", page: "/lock-screen", title: "Lock Screen" });
			ReactGA.event({
				category: `Screen Change`,
				action: `Set Screen to Locked`
			});
		}

		const statusBar = document.getElementById('status-bar');
		if (statusBar) statusBar.blur();
		setTimeout(() => {
			this.setState({ screen_locked: true });
		}, 100); // waiting for all windows to close (transition-duration)
		localStorage.setItem('screen-locked', true);
	};

	unLockScreen = () => {
		const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
		if (TRACKING_ID) {
			ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Desktop" });
		}

		window.removeEventListener('click', this.unLockScreen);
		window.removeEventListener('keypress', this.unLockScreen);

		this.setState({ screen_locked: false });
		localStorage.setItem('screen-locked', false);
	};

	changeBackgroundImage = (img_name) => {
	   const validWallpapers = [
		   'wall-1', 'wall-2', 'wall-3', 'wall-4', 'wall-5', 'wall-6', 'wall-7', 'wall-8'
	   ];
	   const newImg = validWallpapers.includes(img_name) ? img_name : 'wall-1';
	   this.setState({ bg_image_name: newImg });
	   localStorage.setItem('bg-image', newImg);
	};


	shutDown = () => {
		const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
		if (TRACKING_ID) {
			ReactGA.send({ hitType: "pageview", page: "/switch-off", title: "Shutdown" });
			ReactGA.event({
				category: `Screen Change`,
				action: `Switched off the Ubuntu`
			});
		}
		const statusBar = document.getElementById('status-bar');
		if (statusBar) statusBar.blur();
		this.setState({ shutDownScreen: true, showPowerDialog: false });
		localStorage.setItem('shut-down', true);
	};

	restart = () => {
		// Simulate restart: show booting screen again
		this.setState({ showPowerDialog: false, shutDownScreen: false, booting_screen: true });
		this.setTimeOutBootScreen();
		localStorage.setItem('shut-down', false);
	};

	logOut = () => {
		// Simulate log out: lock the screen
		this.setState({ showPowerDialog: false, screen_locked: true });
		localStorage.setItem('screen-locked', true);
	};

	openPowerDialog = () => {
		this.setState({ showPowerDialog: true });
	};

	closePowerDialog = () => {
		this.setState({ showPowerDialog: false });
	};

	turnOn = () => {
		const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
		if (TRACKING_ID) {
			ReactGA.send({ hitType: "pageview", page: "/desktop", title: "Desktop" });
		}

		this.setState({ shutDownScreen: false, booting_screen: true });
		this.setTimeOutBootScreen();
		localStorage.setItem('shut-down', false);
	};

	// Handler to show the context menu
	handleContextMenu = (event) => {
		event.preventDefault(); // Prevent default browser context menu
		this.setState({
			contextMenuVisible: true,
			contextMenuPosition: { x: event.clientX, y: event.clientY }
		});
	};

	// Handler to hide the context menu
	hideContextMenu = () => {
		this.setState({ contextMenuVisible: false });
	};

	render() {
		return (
			<div className="w-screen h-screen overflow-hidden" id="monitor-screen" onContextMenu={this.handleContextMenu}>
				<LockScreen
					isLocked={this.state.screen_locked}
					bgImgName={this.state.bg_image_name}
					unLockScreen={this.unLockScreen}
				/>
				<BootingScreen
					visible={this.state.booting_screen}
					isShutDown={this.state.shutDownScreen}
					turnOn={this.turnOn}
				/>
				<Navbar lockScreen={this.lockScreen} shutDown={this.openPowerDialog} />
				<Desktop bg_image_name={this.state.bg_image_name} changeBackgroundImage={this.changeBackgroundImage}
					contextMenuVisible={this.state.contextMenuVisible}
					contextMenuPosition={this.state.contextMenuPosition}
					hideContextMenu={this.hideContextMenu}
				/>
				{/* Power Off / Restart / Log Out Dialog */}
				{this.state.showPowerDialog && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
						<div className="bg-ub-cool-grey rounded-lg shadow-lg p-8 w-80 text-center">
							<div className="text-lg font-semibold mb-4 text-white">Power Off / Log Out</div>
							<button className="w-full py-2 my-1 rounded bg-ub-orange text-white font-medium hover:bg-orange-600 transition" onClick={this.shutDown}>Power Off</button>
							<button className="w-full py-2 my-1 rounded bg-ub-grey text-white font-medium hover:bg-gray-700 transition" onClick={this.restart}>Restart</button>
							<button className="w-full py-2 my-1 rounded bg-ub-grey text-white font-medium hover:bg-gray-700 transition" onClick={this.logOut}>Log Out</button>
							<button className="w-full py-2 my-1 rounded bg-gray-700 text-white font-medium hover:bg-gray-800 transition" onClick={this.closePowerDialog}>Cancel</button>
						</div>
					</div>
				)}
			</div>
		);
	}
}

Ubuntu.propTypes = {
	// No props currently, but add here if needed in future
};
