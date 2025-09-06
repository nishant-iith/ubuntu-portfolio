import React, { Component } from 'react'
import PropTypes from 'prop-types';
import $ from 'jquery';
import ReactGA from 'react-ga4';

export class Terminal extends Component {
    constructor() {
        super();
        this.cursor = null; // Store interval ID
        this.terminal_rows = 1;
        this.current_directory = "~";
        this.curr_dir_name = "root";
        this.prev_commands = [];
        this.commands_index = -1;
        this.child_directories = {
            root: ["education", "projects", "experience", "skills", "languages", "courses", "extracurricular", "contact"],
            education: ["BTech_Biomedical_Engineering_IITH.txt", "Double_Major_Entrepreneurship_IITH.txt", "Minor_Economics_IITH.txt", "Class_XII_CBSE.txt", "Class_X_CBSE.txt"],
            experience: ["Goldman_Sachs_Summer_Analyst_2025.txt", "Pentakod_Python_Developer_Intern_2024.txt"],
            projects: ["Hybrid_CNN_LSTM_Emotion_Recognition.txt", "Data_Structures_Comparison.txt", "Route_Optimization_Tool.txt", "CPU_Scheduling_Algorithms.txt"],
            skills: ["Programming_Languages.txt", "Development_Tools.txt", "Python_Libraries.txt", "Other_Tools.txt"],
            languages: ["C", "C++", "Python", "SQL", "FORTRAN", "MATLAB", "VERILOG", "HTML", "CSS"],
            courses: ["Computer_Science.txt", "Mathematics.txt", "Artificial_Intelligence.txt"],
            extracurricular: ["NCC_Gold_Medal.txt", "Vishwakarma_Awards.txt", "Office_of_Career_Services.txt", "Finance_and_Consulting_Club.txt"],
            contact: ["email.txt", "phone.txt", "github.txt"]
        };
        this.state = {
            terminal: [],
        }
    }

    componentDidMount() {
        this.reStartTerminal();
    }

    componentDidUpdate() {
        // Clear previous interval before starting new one
        if (this.cursor) {
            clearInterval(this.cursor);
            this.cursor = null;
        }
        this.startCursor(this.terminal_rows - 2);
    }

    componentWillUnmount() {
        // Clean up interval to prevent memory leaks
        if (this.cursor) {
            clearInterval(this.cursor);
            this.cursor = null;
        }
    }

    reStartTerminal = () => {
        // Clean up previous cursor interval
        if (this.cursor) {
            clearInterval(this.cursor);
            this.cursor = null;
        }
        $('#terminal-body').empty();
        this.appendTerminalRow();
    }

    appendTerminalRow = () => {
        let terminal = this.state.terminal;
        terminal.push(this.terminalRow(this.terminal_rows));
        this.setState({ terminal });
        this.terminal_rows += 2;
    }

    terminalRow = (id) => {
        return (
            <React.Fragment key={id}>
                <div className="flex w-full h-5">
                    <div className="flex">
                        <div className=" text-ubt-green">nishant@Dell</div>
                        <div className="text-white mx-px font-medium">:</div>
                        <div className=" text-ubt-blue">{this.current_directory}</div>
                        <div className="text-white mx-px font-medium mr-1">$</div>
                    </div>
                    <div id="cmd" onClick={this.focusCursor} className=" bg-transperent relative flex-1 overflow-hidden">
                        <span id={`show-${id}`} className=" float-left whitespace-pre pb-1 opacity-100 font-normal tracking-wider"></span>
                        <div id={`cursor-${id}`} className=" float-left mt-1 w-1.5 h-3.5 bg-white"></div>
                        <input id={`terminal-input-${id}`} data-row-id={id} onKeyDown={this.checkKey} onBlur={this.unFocusCursor} className=" absolute top-0 left-0 w-full opacity-0 outline-none bg-transparent" spellCheck={false} autoFocus={true} autoComplete="off" type="text" />
                    </div>
                </div>
                <div id={`row-result-${id}`} className={"my-2 font-normal"}></div>
            </React.Fragment>
        );

    }

    focusCursor = (e) => {
        clearInterval(this.cursor);
        this.startCursor($(e.target).data("row-id"));
    }

    unFocusCursor = (e) => {
        this.stopCursor($(e.target).data("row-id"));
    }

    startCursor = (id) => {
        // Clean up previous cursor interval
        if (this.cursor) {
            clearInterval(this.cursor);
            this.cursor = null;
        }
        
        $(`input#terminal-input-${id}`).trigger("focus");
        
        // On input change, set current text in span
        $(`input#terminal-input-${id}`).on("input", function () {
            $(`#cmd span#show-${id}`).text($(this).val());
        });
        
        // Store the interval ID for proper cleanup
        this.cursor = window.setInterval(() => {
            const cursorElement = $(`#cursor-${id}`);
            if (cursorElement.length) {
                if (cursorElement.css('visibility') === 'visible') {
                    cursorElement.css({ visibility: 'hidden' });
                } else {
                    cursorElement.css({ visibility: 'visible' });
                }
            } else {
                // Clear interval if element doesn't exist
                if (this.cursor) {
                    clearInterval(this.cursor);
                    this.cursor = null;
                }
            }
        }, 500);
    }

    stopCursor = (id) => {
        if (this.cursor) {
            clearInterval(this.cursor);
            this.cursor = null;
        }
        $(`#cursor-${id}`).css({ visibility: 'visible' });
    }

    removeCursor = (id) => {
        this.stopCursor(id);
        $(`#cursor-${id}`).css({ display: 'none' });
    }

    clearInput = (id) => {
        $(`input#terminal-input-${id}`).trigger("blur");
    }

    checkKey = (e) => {
        if (e.key === "Enter") {
            let terminal_row_id = $(e.target).data("row-id");
            let command = $(`input#terminal-input-${terminal_row_id}`).val().trim();
            if (command.length !== 0) {
                this.removeCursor(terminal_row_id);
                this.handleCommands(command, terminal_row_id);
            }
            else return;
            // push to history
            this.prev_commands.push(command);
            this.commands_index = this.prev_commands.length - 1;

            this.clearInput(terminal_row_id);
        }
        else if (e.key === "ArrowUp") {
            let prev_command;

            if (this.commands_index <= -1) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index--;
        }
        else if (e.key === "ArrowDown") {
            let prev_command;

            if (this.commands_index >= this.prev_commands.length) return;
            if (this.commands_index <= -1) this.commands_index = 0;

            if (this.commands_index === this.prev_commands.length) prev_command = "";
            else prev_command = this.prev_commands[this.commands_index];

            let terminal_row_id = $(e.target).data("row-id");

            $(`input#terminal-input-${terminal_row_id}`).val(prev_command);
            $(`#show-${terminal_row_id}`).text(prev_command);

            this.commands_index++;
        }
    }

    childDirectories = (parent) => {
        let files = [];
        files.push(`<div class="flex justify-start flex-wrap">`)
        this.child_directories[parent].forEach(file => {
            files.push(
                `<span class="font-bold mr-2 text-ubt-blue">'${file}'</span>`
            )
        });
        files.push(`</div>`)
        return files;
    }

    closeTerminal = () => {
        $("#close-terminal").trigger('click');
    }

    handleCommands = (command, rowId) => {
        let words = command.split(' ').filter(Boolean);
        let main = words[0];
        words.shift()
        let result = "";
        let rest = words.join(" ");
        rest = rest.trim();
        const availableCommands = "[ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
        switch (main) {
            case "cd":
                if (words.length === 0 || rest === "") {
                    this.current_directory = "~";
                    this.curr_dir_name = "root"
                    break;
                }
                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }

                if (rest === "personal-documents") {
                    result = `bash /${this.curr_dir_name} : Permission denied 😏`;
                    break;
                }

                if (this.child_directories[this.curr_dir_name].includes(rest)) {
                    this.current_directory += "/" + rest;
                    this.curr_dir_name = rest;
                }
                else if (rest === "." || rest === ".." || rest === "../") {
                    result = "Type 'cd' to go back 😅";
                    break;
                }
                else {
                    result = `bash: cd: ${words}: No such file or directory`;
                }
                break;
            case "ls":
                let target = words[0];
                if (target === "" || target === undefined || target === null) target = this.curr_dir_name;

                if (words.length > 1) {
                    result = "too many arguments, arguments must be <1.";
                    break;
                }
                if (target in this.child_directories) {
                    result = this.childDirectories(target).join("");
                }
                else if (target === "personal-documents") {
                    result = "Nope! 🙃";
                    break;
                }
                else {
                    result = `ls: cannot access '${words}': No such file or directory                    `;
                }
                break;
            case "mkdir":
                if (words[0] !== undefined && words[0] !== "") {
                    this.props.addFolder(words[0]);
                    result = "";
                } else {
                    result = "mkdir: missing operand";
                }
                break;
            case "pwd":
                let str = this.current_directory;
                result = str.replace("~", "/home/nishant")
                break;
            case "echo":
                result = this.xss(words.join(" "));
                break;
            case "todoist":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("todo-ist");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "trash":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("trash");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "about-nishant":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("about-nishant");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "terminal":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("terminal");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "settings":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("settings");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "sendmsg":
                if (words[0] === "." || words.length === 0) {
                    this.props.openApp("gedit");
                } else {
                    result = "Command '" + main + "' not found, or not yet implemented.<br>Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                }
                break;
            case "clear":
                this.reStartTerminal();
                return;
            case "exit":
                this.closeTerminal();
                return;
            case "sudo":
                const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
                if (TRACKING_ID) {
                    ReactGA.event({
                        category: "Sudo Access",
                        action: "lol",
                    });
                }

                result = "<img class=' w-2/5' src='./images/memes/used-sudo-command.webp' />";
                break;
            case "help":
                result = "Available Commands: [ cd, ls, pwd, echo, clear, exit, mkdir, about-nishant, todoist, settings, sendmsg ]";
                break;
            default:
                result = `Command '${main}' not found, or not yet implemented.<br>Available Commands: ${availableCommands}`;
        }
        const resultElement = document.getElementById(`row-result-${rowId}`);
        if (resultElement) {
            // Enhanced XSS protection - sanitize all HTML content
            const htmlAllowedCommands = ['sudo', 'ls', 'help'];
            if (htmlAllowedCommands.includes(main) && this.isValidHtml(result)) {
                // Only allow safe HTML for specific commands
                resultElement.innerHTML = this.sanitizeHtml(result);
            } else {
                // Use textContent for everything else to prevent XSS
                resultElement.textContent = result.replace(/<br\s*\/?>/gi, '\n');
            }
        }
        this.appendTerminalRow();
    }

    // Enhanced XSS protection methods
    xss(str) {
        if (!str) return '';
        return str.split('').map(char => {
            switch (char) {
                case '&':
                    return '&amp;';
                case '<':
                    return '&lt;';
                case '>':
                    return '&gt;';
                case '"':
                    return '&quot;';
                case "'":
                    return '&#x27;';
                case '/':
                    return '&#x2F;';
                default:
                    return char;
            }
        }).join('');
    }

    isValidHtml(str) {
        // Only allow specific safe HTML tags and patterns
        const allowedPatterns = [
            /^[^<]*<br\s*\/?>.*$/i,  // Simple <br> tags
            /^[^<]*<img[^>]*src="[^"]*"[^>]*\/?>.*$/i,  // Simple img tags
            /^[^<]*<span[^>]*>.*<\/span>.*$/i  // Simple span tags
        ];
        return allowedPatterns.some(pattern => pattern.test(str));
    }

    sanitizeHtml(str) {
        // Remove all HTML except safe tags
        return str
            .replace(/<script[^>]*>.*?<\/script>/gi, '')
            .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
            .replace(/on\w+="[^"]*"/gi, '')  // Remove event handlers
            .replace(/javascript:/gi, '')   // Remove javascript: URLs
            .replace(/<object[^>]*>.*?<\/object>/gi, '')
            .replace(/<embed[^>]*>.*?<\/embed>/gi, '');
    }

    render() {
        return (
            <div className="h-full w-full bg-ub-drk-abrgn text-white text-sm font-bold" id="terminal-body">
                {
                    this.state.terminal
                }
            </div>
        )
    }
}

// PropTypes validation
Terminal.propTypes = {
    addFolder: PropTypes.func,
    openApp: PropTypes.func
};

export default Terminal

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp} />;
}
