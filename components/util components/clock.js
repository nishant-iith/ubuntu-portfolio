import { Component } from 'react'

export default class Clock extends Component {
    constructor() {
        super();
        this.month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        this.day_list = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        this.state = {
            hour_12: true,
            current_time: null,  // Start with null to avoid hydration mismatch
            isClient: false
        };
    }

    componentDidMount() {
        // Set initial time and client flag after mounting
        this.setState({
            current_time: new Date(),
            isClient: true
        });

        this.update_time = setInterval(() => {
            this.setState({ current_time: new Date() });
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.update_time);
    }

    render() {
        const { current_time, isClient } = this.state;

        // Show placeholder during SSR and initial client render to prevent hydration mismatch
        if (!isClient || !current_time) {
            return <span className="text-xs">Loading...</span>;
        }

        let day = this.day_list[current_time.getDay()];
        let hour = current_time.getHours();
        let minute = current_time.getMinutes();
        let month = this.month_list[current_time.getMonth()];
        let date = current_time.getDate().toLocaleString();
        let meridiem = (hour < 12 ? "AM" : "PM");

        if (minute.toLocaleString().length === 1) {
            minute = "0" + minute
        }

        if (this.state.hour_12 && hour > 12) hour -= 12;
        if (this.state.hour_12 && hour === 0) hour = 12;

        let display_time;
        if (this.props.onlyTime) {
            display_time = hour + ":" + minute + " " + meridiem;
        }
        else if (this.props.onlyDay) {
            display_time = day + " " + month + " " + date;
        }
        else {
            // Improved spacing for Ubuntu-style display
            display_time = day + ", " + month + " " + date + " " + hour + ":" + minute + " " + meridiem;
        }

        return <span className="text-xs">{display_time}</span>;
    }
}
