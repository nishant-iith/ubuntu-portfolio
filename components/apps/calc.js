import React, { Component } from 'react'
import PropTypes from 'prop-types';

/**
 * Modern Ubuntu-style Calculator with advanced features
 * Supports keyboard input, history, memory functions, and scientific operations
 */
export class Calc extends Component {
    constructor() {
        super();
        this.state = {
            display: '0',
            equation: '',
            previousValue: null,
            operation: null,
            waitingForOperand: false,
            history: [],
            memory: 0,
            showHistory: false,
            lastCalculation: null,
            hasError: false
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    /**
     * Handle keyboard input for calculator operations
     */
    handleKeyPress = (e) => {
        const { key, ctrlKey } = e;

        // Prevent default for calculator keys
        if ('0123456789+-*/=.()'.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
            e.preventDefault();
        }

        if ('0123456789'.includes(key)) {
            this.inputNumber(key);
        } else if ('+-*/'.includes(key)) {
            this.inputOperation(key);
        } else if (key === 'Enter' || key === '=') {
            this.calculate();
        } else if (key === 'Escape' || key === 'c' || key === 'C') {
            this.clear();
        } else if (key === 'Backspace') {
            this.backspace();
        } else if (key === '.') {
            this.inputDecimal();
        } else if (key === '%') {
            this.percentage();
        } else if (ctrlKey && key === 'h') {
            this.toggleHistory();
        }
    }

    /**
     * Input a number digit
     */
    inputNumber = (num) => {
        const { display, waitingForOperand, hasError } = this.state;

        if (hasError) {
            this.clear();
        }

        if (waitingForOperand) {
            this.setState({
                display: String(num),
                waitingForOperand: false,
                equation: this.state.equation + num
            });
        } else {
            this.setState({
                display: display === '0' ? String(num) : display + num,
                equation: display === '0' ? num : this.state.equation + num
            });
        }
    }

    /**
     * Input decimal point
     */
    inputDecimal = () => {
        const { display, waitingForOperand, hasError } = this.state;

        if (hasError) {
            this.clear();
        }

        if (waitingForOperand) {
            this.setState({
                display: '0.',
                waitingForOperand: false,
                equation: this.state.equation + '0.'
            });
        } else if (display.indexOf('.') === -1) {
            this.setState({
                display: display + '.',
                equation: this.state.equation + '.'
            });
        }
    }

    /**
     * Clear all values
     */
    clear = () => {
        this.setState({
            display: '0',
            equation: '',
            previousValue: null,
            operation: null,
            waitingForOperand: false,
            hasError: false
        });
    }

    /**
     * Clear entry (CE)
     */
    clearEntry = () => {
        this.setState({
            display: '0',
            hasError: false
        });
    }

    /**
     * Backspace - remove last digit
     */
    backspace = () => {
        const { display, hasError } = this.state;

        if (hasError) {
            this.clear();
            return;
        }

        if (display.length > 1 && display !== '0') {
            this.setState({
                display: display.slice(0, -1)
            });
        } else {
            this.setState({
                display: '0'
            });
        }
    }

    /**
     * Input operation (+, -, *, /)
     */
    inputOperation = (nextOperation) => {
        const { display, previousValue, operation, waitingForOperand, hasError } = this.state;

        if (hasError) {
            this.clear();
            return;
        }

        const inputValue = parseFloat(display);

        if (previousValue === null) {
            this.setState({
                previousValue: inputValue,
                equation: this.state.equation + ` ${this.getOperationSymbol(nextOperation)} `
            });
        } else if (operation && !waitingForOperand) {
            const currentValue = previousValue || 0;
            const result = this.performCalculation(operation, currentValue, inputValue);

            if (this.state.hasError) return;

            this.setState({
                display: this.formatNumber(result),
                previousValue: result,
                equation: this.state.equation + ` ${this.getOperationSymbol(nextOperation)} `
            });
        }

        this.setState({
            operation: nextOperation,
            waitingForOperand: true
        });
    }

    /**
     * Calculate the final result
     */
    calculate = () => {
        const { display, previousValue, operation, equation, hasError } = this.state;

        if (hasError) {
            this.clear();
            return;
        }

        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const result = this.performCalculation(operation, previousValue, inputValue);

            if (this.state.hasError) return;

            const finalEquation = equation + ` = ${this.formatNumber(result)}`;

            this.setState({
                display: this.formatNumber(result),
                equation: '',
                previousValue: null,
                operation: null,
                waitingForOperand: true,
                lastCalculation: finalEquation,
                history: [...this.state.history.slice(-9), {
                    id: Date.now(),
                    expression: finalEquation,
                    result: result,
                    timestamp: new Date().toLocaleTimeString()
                }]
            });
        }
    }

    /**
     * Perform mathematical calculations
     */
    performCalculation = (operation, firstValue, secondValue) => {
        let result;

        switch (operation) {
            case '+':
                result = firstValue + secondValue;
                break;
            case '-':
                result = firstValue - secondValue;
                break;
            case '*':
                result = firstValue * secondValue;
                break;
            case '/':
                if (secondValue === 0) {
                    this.setState({ hasError: true, display: 'Error: Division by zero' });
                    return 0;
                }
                result = firstValue / secondValue;
                break;
            default:
                result = secondValue;
        }

        // Check for overflow or invalid results
        if (!isFinite(result)) {
            this.setState({ hasError: true, display: 'Error: Invalid operation' });
            return 0;
        }

        return result;
    }

    /**
     * Format number for display
     */
    formatNumber = (num) => {
        if (num === null || num === undefined) return '0';

        // Handle very large or very small numbers
        if (Math.abs(num) >= 1e15 || (Math.abs(num) < 1e-10 && num !== 0)) {
            return num.toExponential(10);
        }

        // Remove trailing zeros and format
        return parseFloat(num.toPrecision(12)).toString();
    }

    /**
     * Get display symbol for operation
     */
    getOperationSymbol = (op) => {
        switch (op) {
            case '+': return '+';
            case '-': return '−';
            case '*': return '×';
            case '/': return '÷';
            default: return op;
        }
    }

    /**
     * Square root function
     */
    squareRoot = () => {
        const { display } = this.state;
        const value = parseFloat(display);

        if (value < 0) {
            this.setState({ hasError: true, display: 'Error: Invalid input' });
            return;
        }

        const result = Math.sqrt(value);
        this.setState({
            display: this.formatNumber(result),
            waitingForOperand: true,
            lastCalculation: `√${value} = ${this.formatNumber(result)}`
        });
    }

    /**
     * Square function
     */
    square = () => {
        const { display } = this.state;
        const value = parseFloat(display);
        const result = value * value;

        this.setState({
            display: this.formatNumber(result),
            waitingForOperand: true,
            lastCalculation: `${value}² = ${this.formatNumber(result)}`
        });
    }

    /**
     * Percentage function
     */
    percentage = () => {
        const { display } = this.state;
        const value = parseFloat(display);
        const result = value / 100;

        this.setState({
            display: this.formatNumber(result),
            waitingForOperand: true
        });
    }

    /**
     * Plus/minus toggle
     */
    toggleSign = () => {
        const { display } = this.state;
        if (display !== '0') {
            this.setState({
                display: display.charAt(0) === '-' ? display.slice(1) : '-' + display
            });
        }
    }

    /**
     * Memory functions
     */
    memoryAdd = () => {
        const { display, memory } = this.state;
        this.setState({ memory: memory + parseFloat(display) });
    }

    memorySubtract = () => {
        const { display, memory } = this.state;
        this.setState({ memory: memory - parseFloat(display) });
    }

    memoryRecall = () => {
        this.setState({
            display: this.formatNumber(this.state.memory),
            waitingForOperand: true
        });
    }

    memoryClear = () => {
        this.setState({ memory: 0 });
    }

    /**
     * Toggle history panel
     */
    toggleHistory = () => {
        this.setState({ showHistory: !this.state.showHistory });
    }

    /**
     * Clear history
     */
    clearHistory = () => {
        this.setState({ history: [] });
    }

    /**
     * Use result from history
     */
    useHistoryResult = (result) => {
        this.setState({
            display: this.formatNumber(result),
            waitingForOperand: true,
            showHistory: false
        });
    }

    /**
     * Render a calculator button
     */
    renderButton = (content, onClick, className = '') => {
        return (
            <button
                key={content}
                className={`h-12 rounded-md text-sm font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${className}`}
                onClick={onClick}
                tabIndex={0}
            >
                {content}
            </button>
        );
    }

    render() {
        const { display, hasError } = this.state;

        return (
            <div className="h-full w-full bg-ub-cool-grey text-white flex flex-col">
                {/* Display */}
                <div className="bg-ub-drk-abrgn p-4 border-b border-gray-600">
                    <div className={`text-right text-2xl font-mono ${hasError ? 'text-red-400' : 'text-white'} min-h-[32px]`}>
                        {display}
                    </div>
                </div>

                {/* Button Grid */}
                <div className="flex-1 p-3">
                    <div className="grid grid-cols-4 gap-1 h-full">
                        {/* Row 1 */}
                        {this.renderButton('C', this.clear, 'bg-gray-600 hover:bg-gray-500 text-white')}
                        {this.renderButton('⌫', this.backspace, 'bg-gray-600 hover:bg-gray-500 text-white')}
                        {this.renderButton('%', this.percentage, 'bg-gray-600 hover:bg-gray-500 text-white')}
                        {this.renderButton('÷', () => this.inputOperation('/'), 'bg-ub-orange hover:bg-orange-600 text-white')}

                        {/* Row 2 */}
                        {this.renderButton('7', () => this.inputNumber('7'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('8', () => this.inputNumber('8'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('9', () => this.inputNumber('9'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('×', () => this.inputOperation('*'), 'bg-ub-orange hover:bg-orange-600 text-white')}

                        {/* Row 3 */}
                        {this.renderButton('4', () => this.inputNumber('4'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('5', () => this.inputNumber('5'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('6', () => this.inputNumber('6'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('−', () => this.inputOperation('-'), 'bg-ub-orange hover:bg-orange-600 text-white')}

                        {/* Row 4 */}
                        {this.renderButton('1', () => this.inputNumber('1'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('2', () => this.inputNumber('2'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('3', () => this.inputNumber('3'), 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('+', () => this.inputOperation('+'), 'bg-ub-orange hover:bg-orange-600 text-white')}

                        {/* Row 5 */}
                        {this.renderButton('0', () => this.inputNumber('0'), 'bg-gray-700 hover:bg-gray-600 text-white col-span-2')}
                        {this.renderButton('.', this.inputDecimal, 'bg-gray-700 hover:bg-gray-600 text-white')}
                        {this.renderButton('=', this.calculate, 'bg-green-600 hover:bg-green-500 text-white')}
                    </div>
                </div>
            </div>
        );
    }
}

// PropTypes validation
Calc.propTypes = {
    addFolder: PropTypes.func,
    openApp: PropTypes.func
};

export default Calc

export const displayTerminalCalc = (addFolder, openApp) => {
    return <Calc addFolder={addFolder} openApp={openApp} />;
}