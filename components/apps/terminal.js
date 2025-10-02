import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactGA from 'react-ga4';

const Terminal = ({ addFolder, openApp }) => {
    // Terminal state
    const [history, setHistory] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [currentPath, setCurrentPath] = useState('~');
    const [currentDir, setCurrentDir] = useState('root');
    const [cursorVisible, setCursorVisible] = useState(true);

    // Refs
    const inputRef = useRef(null);
    const terminalRef = useRef(null);
    const cursorIntervalRef = useRef(null);

    // File system structure
    const fileSystem = useMemo(() => ({
        root: {
            type: 'directory',
            children: {
                education: {
                    type: 'directory',
                    children: {
                        'BTech_Biomedical_Engineering_IITH.txt': { type: 'file', content: 'B.Tech in Biomedical Engineering from IIT Hyderabad' },
                        'Double_Major_Entrepreneurship_IITH.txt': { type: 'file', content: 'Double Major in Entrepreneurship from IIT Hyderabad' },
                        'Minor_Economics_IITH.txt': { type: 'file', content: 'Minor in Economics from IIT Hyderabad' },
                        'Class_XII_CBSE.txt': { type: 'file', content: 'Class XII CBSE Board Examination' },
                        'Class_X_CBSE.txt': { type: 'file', content: 'Class X CBSE Board Examination' }
                    }
                },
                projects: {
                    type: 'directory',
                    children: {
                        'Hybrid_CNN_LSTM_Emotion_Recognition.txt': { type: 'file', content: 'AI project for emotion recognition using hybrid CNN-LSTM architecture' },
                        'Data_Structures_Comparison.txt': { type: 'file', content: 'Comparative analysis of various data structures and their performance' },
                        'Route_Optimization_Tool.txt': { type: 'file', content: 'Tool for optimizing routes using graph algorithms' },
                        'CPU_Scheduling_Algorithms.txt': { type: 'file', content: 'Implementation and comparison of CPU scheduling algorithms' }
                    }
                },
                experience: {
                    type: 'directory',
                    children: {
                        'Goldman_Sachs_Summer_Analyst_2025.txt': { type: 'file', content: 'Summer Analyst position at Goldman Sachs (2025)' },
                        'Pentakod_Python_Developer_Intern_2024.txt': { type: 'file', content: 'Python Developer Intern at Pentakod (2024)' }
                    }
                },
                skills: {
                    type: 'directory',
                    children: {
                        'Programming_Languages.txt': { type: 'file', content: 'C, C++, Python, Java, JavaScript, SQL' },
                        'Development_Tools.txt': { type: 'file', content: 'Git, Docker, VS Code, IntelliJ, Jupyter' },
                        'Python_Libraries.txt': { type: 'file', content: 'NumPy, Pandas, TensorFlow, PyTorch, Scikit-learn' },
                        'Other_Tools.txt': { type: 'file', content: 'MATLAB, R, MongoDB, PostgreSQL' }
                    }
                },
                languages: {
                    type: 'directory',
                    children: {
                        'C': { type: 'file', content: 'Advanced proficiency in C programming' },
                        'C++': { type: 'file', content: 'Expert level C++ with STL and OOP' },
                        'Python': { type: 'file', content: 'Professional Python development experience' },
                        'SQL': { type: 'file', content: 'Database design and query optimization' },
                        'FORTRAN': { type: 'file', content: 'Scientific computing with FORTRAN' },
                        'MATLAB': { type: 'file', content: 'Mathematical modeling and simulation' },
                        'VERILOG': { type: 'file', content: 'Hardware description language for FPGA' },
                        'HTML': { type: 'file', content: 'Web markup and semantic HTML' },
                        'CSS': { type: 'file', content: 'Advanced styling and responsive design' }
                    }
                },
                courses: {
                    type: 'directory',
                    children: {
                        'Computer_Science.txt': { type: 'file', content: 'Data Structures, Algorithms, Database Systems, Computer Networks' },
                        'Mathematics.txt': { type: 'file', content: 'Linear Algebra, Calculus, Statistics, Discrete Mathematics' },
                        'Artificial_Intelligence.txt': { type: 'file', content: 'Machine Learning, Deep Learning, Neural Networks, Computer Vision' }
                    }
                },
                extracurricular: {
                    type: 'directory',
                    children: {
                        'NCC_Gold_Medal.txt': { type: 'file', content: 'National Cadet Corps Gold Medal recipient' },
                        'Vishwakarma_Awards.txt': { type: 'file', content: 'Excellence awards in technical competitions' },
                        'Office_of_Career_Services.txt': { type: 'file', content: 'Career services team member at IIT Hyderabad' },
                        'Finance_and_Consulting_Club.txt': { type: 'file', content: 'Active member of Finance and Consulting Club' }
                    }
                },
                contact: {
                    type: 'directory',
                    children: {
                        'email.txt': { type: 'file', content: 'nishant@example.com' },
                        'phone.txt': { type: 'file', content: '+91-XXXXXXXXXX' },
                        'github.txt': { type: 'file', content: 'https://github.com/nishant-iith' }
                    }
                }
            }
        }
    }), []);

    // Cursor blinking effect
    useEffect(() => {
        cursorIntervalRef.current = setInterval(() => {
            setCursorVisible(prev => !prev);
        }, 500);

        return () => {
            if (cursorIntervalRef.current) {
                clearInterval(cursorIntervalRef.current);
            }
        };
    }, []);

    // Auto-focus input
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [history]);

    // Scroll to bottom when new content is added
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Get current directory object
    const getCurrentDirectory = useCallback(() => {
        const pathParts = currentPath === '~' ? ['root'] : currentPath.replace('~/', '').split('/').filter(Boolean);
        pathParts[0] = 'root'; // Ensure we start from root
        
        let current = fileSystem;
        for (const part of pathParts) {
            current = current[part]?.children || {};
        }
        return current;
    }, [currentPath, fileSystem]);

    // Navigate to directory
    const navigateToDirectory = useCallback((dirName) => {
        if (dirName === '' || dirName === '~') {
            setCurrentPath('~');
            setCurrentDir('root');
            return { success: true };
        }

        if (dirName === '.' || dirName === '..' || dirName === '../') {
            return { success: false, error: "Type 'cd' to go back 😅" };
        }

        if (dirName === 'personal-documents') {
            return { success: false, error: `bash /${currentDir} : Permission denied 😏` };
        }

        const currentDirContents = getCurrentDirectory();
        
        if (currentDirContents[dirName] && currentDirContents[dirName].type === 'directory') {
            const newPath = currentPath === '~' ? `~/${dirName}` : `${currentPath}/${dirName}`;
            setCurrentPath(newPath);
            setCurrentDir(dirName);
            return { success: true };
        }

        return { success: false, error: `bash: cd: ${dirName}: No such file or directory` };
    }, [currentPath, currentDir, getCurrentDirectory]);

    // List directory contents
    const listDirectory = useCallback((targetDir = null) => {
        const target = targetDir || currentDir;
        
        if (target === 'personal-documents') {
            return { success: false, error: 'Nope! 🙃' };
        }

        let targetContents;
        if (target === currentDir || !targetDir) {
            targetContents = getCurrentDirectory();
        } else if (target === 'root' || fileSystem.root.children[target]) {
            targetContents = fileSystem.root.children[target]?.children || fileSystem.root.children;
        } else {
            return { success: false, error: `ls: cannot access '${target}': No such file or directory` };
        }

        const items = Object.keys(targetContents).map(name => {
            const item = targetContents[name];
            const className = item.type === 'directory' ? 'text-ubt-blue font-bold' : 'text-ubt-green';
            return `<span class="${className} mr-4 mb-1 inline-block">${name}</span>`;
        });

        return { success: true, output: `<div class="flex flex-wrap gap-1">${items.join('')}</div>` };
    }, [currentDir, getCurrentDirectory, fileSystem]);

    // Sanitize and escape text for safe display
    const sanitizeText = useCallback((text) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;');
    }, []);

    // Advanced command parsing with support for quotes and escaping
    const parseCommand = useCallback((input) => {
        const parts = [];
        let current = '';
        let inQuotes = false;
        let quoteChar = '';
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            if (!inQuotes && (char === '"' || char === "'")) {
                inQuotes = true;
                quoteChar = char;
            } else if (inQuotes && char === quoteChar) {
                inQuotes = false;
                quoteChar = '';
            } else if (!inQuotes && char === ' ') {
                if (current.trim()) {
                    parts.push(current.trim());
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current.trim()) {
            parts.push(current.trim());
        }
        
        return parts;
    }, []);

    // Validate command arguments
    const validateCommand = useCallback((command, args, expectedArgs) => {
        if (expectedArgs.min !== undefined && args.length < expectedArgs.min) {
            return { valid: false, error: `${command}: missing operand${expectedArgs.min > 1 ? 's' : ''}` };
        }
        if (expectedArgs.max !== undefined && args.length > expectedArgs.max) {
            return { valid: false, error: `${command}: too many arguments` };
        }
        if (expectedArgs.exact !== undefined && args.length !== expectedArgs.exact) {
            return { valid: false, error: `${command}: expected ${expectedArgs.exact} argument${expectedArgs.exact !== 1 ? 's' : ''}, got ${args.length}` };
        }
        return { valid: true };
    }, []);

    // Process commands with advanced parsing
    const processCommand = useCallback((input) => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        const parts = parseCommand(trimmedInput);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output = '';
        let isHtml = false;

        switch (command) {
            case 'help':
                output = `Available Commands:
Navigation:  cd, ls, pwd, clear, exit
File ops:    cat, mkdir, echo
Apps:        about-nishant, settings, sendmsg
System:      help, whoami, date, uptime
Fun:         sudo, cowsay`;
                break;

            case 'whoami':
                output = 'nishant';
                break;

            case 'date':
                output = new Date().toString();
                break;

            case 'uptime':
                const uptime = Math.floor((Date.now() - performance.timeOrigin) / 1000);
                const hours = Math.floor(uptime / 3600);
                const minutes = Math.floor((uptime % 3600) / 60);
                const seconds = uptime % 60;
                output = `up ${hours}h ${minutes}m ${seconds}s`;
                break;

            case 'cowsay':
                const message = args.join(' ') || 'Hello from Ubuntu Terminal!';
                output = `
 ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
                `;
                break;

            case 'clear':
                setHistory([]);
                return;

            case 'exit':
                if (openApp) {
                    // Close terminal
                    document.getElementById('close-terminal')?.click();
                }
                return;

            case 'pwd':
                output = currentPath.replace('~', '/home/nishant');
                break;

            case 'cd':
                const result = navigateToDirectory(args[0] || '');
                if (!result.success) {
                    output = result.error;
                }
                break;

            case 'ls':
                const lsValidation = validateCommand('ls', args, { max: 1 });
                if (!lsValidation.valid) {
                    output = lsValidation.error;
                } else {
                    const lsResult = listDirectory(args[0]);
                    if (lsResult.success) {
                        output = lsResult.output;
                        isHtml = true;
                    } else {
                        output = lsResult.error;
                    }
                }
                break;

            case 'cat':
                const catValidation = validateCommand('cat', args, { min: 1, max: 1 });
                if (!catValidation.valid) {
                    output = catValidation.error;
                } else {
                    const filename = args[0];
                    const currentDirContents = getCurrentDirectory();
                    if (currentDirContents[filename] && currentDirContents[filename].type === 'file') {
                        output = currentDirContents[filename].content;
                    } else {
                        output = `cat: ${filename}: No such file or directory`;
                    }
                }
                break;

            case 'echo':
                output = sanitizeText(args.join(' '));
                break;

            case 'mkdir':
                if (args.length === 0) {
                    output = 'mkdir: missing operand';
                } else if (args.length > 1) {
                    output = 'mkdir: too many arguments';
                } else {
                    if (addFolder) {
                        addFolder(args[0]);
                        output = '';
                    } else {
                        output = 'mkdir: operation not supported';
                    }
                }
                break;

            case 'sudo':
                // Google Analytics
                const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
                if (TRACKING_ID) {
                    ReactGA.event({
                        category: "Sudo Access",
                        action: "lol",
                    });
                }
                output = `<img class="w-2/5 max-w-md my-2" src="./images/memes/used-sudo-command.webp" alt="Sudo meme" />`;
                isHtml = true;
                break;

            case 'about-nishant':
                if (openApp) {
                    openApp('about-nishant');
                    output = 'Opening About Nishant...';
                } else {
                    output = 'about-nishant: command not available';
                }
                break;

            case 'todoist':
                output = 'todoist: command removed. Try "github" or "about-nishant" instead.';
                break;

            case 'settings':
                if (openApp) {
                    openApp('settings');
                    output = 'Opening Settings...';
                } else {
                    output = 'settings: command not available';
                }
                break;

            case 'sendmsg':
                if (openApp) {
                    openApp('gedit');
                    output = 'Opening Contact Form...';
                } else {
                    output = 'sendmsg: command not available';
                }
                break;

            default:
                output = `Command '${command}' not found. Type 'help' for available commands.`;
                break;
        }

        // Add to history
        setHistory(prev => [...prev, {
            id: Date.now(),
            input: trimmedInput,
            output: output,
            isHtml: isHtml,
            path: currentPath,
            dir: currentDir
        }]);

    }, [currentPath, currentDir, getCurrentDirectory, navigateToDirectory, listDirectory, sanitizeText, addFolder, openApp]);

    // Handle input submission
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        
        if (!currentInput.trim()) return;

        // Add to command history
        setCommandHistory(prev => [...prev, currentInput]);
        setHistoryIndex(-1);

        // Process the command
        processCommand(currentInput);

        // Clear input
        setCurrentInput('');
    }, [currentInput, processCommand]);

    // Handle input changes
    const handleInputChange = useCallback((e) => {
        setCurrentInput(e.target.value);
        setHistoryIndex(-1);
    }, []);

    // Get command suggestions
    const getCommandSuggestions = useCallback((partial) => {
        const commands = [
            'help', 'whoami', 'date', 'uptime', 'clear', 'exit', 'pwd', 'cd', 'ls', 'cat',
            'echo', 'mkdir', 'sudo', 'cowsay', 'about-nishant', 'settings', 'sendmsg'
        ];
        return commands.filter(cmd => cmd.startsWith(partial.toLowerCase()));
    }, []);

    // Get file/directory suggestions for current directory
    const getPathSuggestions = useCallback((partial) => {
        const currentDirContents = getCurrentDirectory();
        return Object.keys(currentDirContents).filter(name => 
            name.toLowerCase().startsWith(partial.toLowerCase())
        );
    }, [getCurrentDirectory]);

    // Handle tab completion
    const handleTabCompletion = useCallback(() => {
        const words = currentInput.split(' ');
        const lastWord = words[words.length - 1] || '';
        
        let suggestions = [];
        
        if (words.length === 1) {
            // Command completion
            suggestions = getCommandSuggestions(lastWord);
        } else if (words[0] === 'cd' || words[0] === 'ls' || words[0] === 'cat') {
            // Path completion for navigation commands
            suggestions = getPathSuggestions(lastWord);
        }
        
        if (suggestions.length === 1) {
            // Auto-complete if only one match
            const newWords = [...words.slice(0, -1), suggestions[0]];
            setCurrentInput(newWords.join(' ') + (words.length === 1 ? ' ' : ''));
        } else if (suggestions.length > 1) {
            // Show suggestions
            const suggestionText = suggestions.join('  ');
            setHistory(prev => [...prev, {
                id: Date.now(),
                input: currentInput,
                output: suggestionText,
                isHtml: false,
                path: currentPath,
                dir: currentDir,
                isTabCompletion: true
            }]);
        }
    }, [currentInput, getCommandSuggestions, getPathSuggestions, currentPath, currentDir]);

    // Handle key navigation and special keys
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (commandHistory.length > 0) {
                const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
                setHistoryIndex(newIndex);
                setCurrentInput(commandHistory[newIndex]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                const newIndex = historyIndex + 1;
                if (newIndex >= commandHistory.length) {
                    setHistoryIndex(-1);
                    setCurrentInput('');
                } else {
                    setHistoryIndex(newIndex);
                    setCurrentInput(commandHistory[newIndex]);
                }
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            handleTabCompletion();
        } else if (e.key === 'l' && e.ctrlKey) {
            // Ctrl+L to clear screen
            e.preventDefault();
            setHistory([]);
        } else if (e.key === 'c' && e.ctrlKey) {
            // Ctrl+C to cancel current input
            e.preventDefault();
            setCurrentInput('');
            setHistoryIndex(-1);
        }
    }, [commandHistory, historyIndex, handleTabCompletion]);

    // Handle clicks to focus input
    const handleTerminalClick = useCallback(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    return (
        <div 
            ref={terminalRef}
            className="h-full w-full bg-ub-drk-abrgn text-ubt-grey font-ubuntu-mono text-sm p-4 overflow-y-auto cursor-text ubuntu-terminal"
            onClick={handleTerminalClick}
        >
            {/* Welcome message */}
            {history.length === 0 && (
                <div className="mb-4 text-ubt-warm-grey">
                    <div className="text-ubt-grey">Welcome to Nishant's Portfolio Terminal!</div>
                    <div className="text-ubt-green">Type 'help' to see available commands.</div>
                    <div className="mt-2 text-ubt-warm-grey text-xs">Tip: Use arrow keys to navigate command history</div>
                </div>
            )}

            {/* Command history */}
            {history.map((entry) => (
                <div key={entry.id} className="mb-2">
                    {/* Command line */}
                    <div className="flex items-center">
                        <span className="text-ubt-green font-medium">nishant@Dell</span>
                        <span className="text-ubt-grey mx-1">:</span>
                        <span className="text-ubt-blue font-medium">{entry.path}</span>
                        <span className="text-ubt-grey mr-2">$</span>
                        <span className="text-ubt-grey">{entry.input}</span>
                    </div>
                    
                    {/* Command output */}
                    {entry.output && (
                        <div className="mt-1 ml-4 text-ubt-grey">
                            {entry.isHtml ? (
                                <div dangerouslySetInnerHTML={{ __html: entry.output }} />
                            ) : (
                                <pre className="whitespace-pre-wrap font-ubuntu-mono text-sm">{entry.output}</pre>
                            )}
                        </div>
                    )}
                </div>
            ))}

            {/* Current input line */}
            <form onSubmit={handleSubmit} className="flex items-center">
                <span className="text-ubt-green font-medium">nishant@Dell</span>
                <span className="text-ubt-grey mx-1">:</span>
                <span className="text-ubt-blue font-medium">{currentPath}</span>
                <span className="text-ubt-grey mr-2">$</span>
                <div className="flex-1 relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className="bg-transparent outline-none text-ubt-grey w-full caret-transparent font-ubuntu-mono"
                        autoComplete="off"
                        spellCheck="false"
                    />
                    <span className="text-ubt-grey absolute left-0 top-0 pointer-events-none">{currentInput}</span>
                    <span 
                        className={`absolute top-0 w-2 h-4 bg-ubt-grey ml-0.5 ${cursorVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100`}
                        style={{ left: `${currentInput.length * 0.6}em` }}
                    >
                        &nbsp;
                    </span>
                </div>
            </form>
        </div>
    );
};

Terminal.propTypes = {
    addFolder: PropTypes.func,
    openApp: PropTypes.func
};

export default Terminal;

export const displayTerminal = (addFolder, openApp) => {
    return <Terminal addFolder={addFolder} openApp={openApp} />;
};