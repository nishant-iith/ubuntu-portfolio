import React, { Component } from 'react'
import PropTypes from 'prop-types';

export class Calc extends Component {
    constructor() {
        super();
        this.state = {
            display: '0',
            previousValue: null,
            operation: null,
            waitingForOperand: false,
            history: []
        };
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress = (e) => {
        const { key } = e;
        
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
        }
    }

    inputNumber = (num) => {
        const { display, waitingForOperand } = this.state;

        if (waitingForOperand) {
            this.setState({
                display: String(num),
                waitingForOperand: false
            });
        } else {
            this.setState({
                display: display === '0' ? String(num) : display + num
            });
        }
    }

    inputDecimal = () => {
        const { display, waitingForOperand } = this.state;

        if (waitingForOperand) {
            this.setState({
                display: '0.',
                waitingForOperand: false
            });
        } else if (display.indexOf('.') === -1) {
            this.setState({
                display: display + '.'
            });
        }
    }

    clear = () => {
        this.setState({
            display: '0',
            previousValue: null,
            operation: null,
            waitingForOperand: false
        });
    }

    backspace = () => {
        const { display } = this.state;
        
        if (display.length > 1) {
            this.setState({
                display: display.slice(0, -1)
            });
        } else {
            this.setState({
                display: '0'
            });
        }
    }

    inputOperation = (nextOperation) => {
        const { display, previousValue, operation, waitingForOperand } = this.state;
        const inputValue = parseFloat(display);

        if (previousValue === null) {
            this.setState({
                previousValue: inputValue
            });
        } else if (operation && !waitingForOperand) {
            const currentValue = previousValue || 0;
            const newValue = this.performCalculation(operation, currentValue, inputValue);

            this.setState({
                display: String(newValue),
                previousValue: newValue
            });
        }

        this.setState({
            operation: nextOperation,
            waitingForOperand: true
        });
    }

    calculate = () => {
        const { display, previousValue, operation } = this.state;
        const inputValue = parseFloat(display);

        if (previousValue !== null && operation) {
            const newValue = this.performCalculation(operation, previousValue, inputValue);
            
            this.setState({
                display: String(newValue),
                previousValue: null,
                operation: null,
                waitingForOperand: true,
                history: [...this.state.history, {
                    expression: `${previousValue} ${operation} ${inputValue}`,
                    result: newValue
                }]
            });
        }
    }

    performCalculation = (operation, firstValue, secondValue) => {
        switch (operation) {
            case '+':
                return firstValue + secondValue;
            case '-':
                return firstValue - secondValue;
            case '*':
                return firstValue * secondValue;
            case '/':
                return secondValue !== 0 ? firstValue / secondValue : 0;
            default:
                return secondValue;
        }
    }

    renderButton = (content, onClick, className = '', id = '') => {
        return (
            <button
                key={content}
                id={id}
                className={`h-12 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 border border-gray-300 rounded text-black font-medium transition-colors duration-150 ${className}`}
                onClick={onClick}
                tabIndex={0}
                aria-label={typeof content === 'string' ? content : undefined}
            >
                {content}
            </button>
        );
    }

    render() {
        const { display } = this.state;

        return (
            <div className="h-full w-full bg-white p-4 flex flex-col">
                {/* Header */}
                <div className="bg-orange-500 text-white p-2 rounded-t mb-4">
                    <h2 className="text-lg font-semibold">Calculator</h2>
                </div>

                {/* Display */}
                <div className="bg-black text-white p-4 rounded mb-4 text-right">
                    <div className="text-3xl font-mono break-all">
                        {display}
                    </div>
                </div>

                {/* Button Grid */}
                <div className="grid grid-cols-4 gap-2 flex-1">
                    {/* Row 1 */}
                    {this.renderButton('C', this.clear, 'bg-red-400 hover:bg-red-500 text-white col-span-2')}
                    {this.renderButton('⌫', this.backspace, 'bg-yellow-400 hover:bg-yellow-500')}
                    {this.renderButton('÷', () => this.inputOperation('/'), 'bg-blue-400 hover:bg-blue-500 text-white')}

                    {/* Row 2 */}
                    {this.renderButton('7', () => this.inputNumber('7'))}
                    {this.renderButton('8', () => this.inputNumber('8'))}
                    {this.renderButton('9', () => this.inputNumber('9'))}
                    {this.renderButton('×', () => this.inputOperation('*'), 'bg-blue-400 hover:bg-blue-500 text-white')}

                    {/* Row 3 */}
                    {this.renderButton('4', () => this.inputNumber('4'))}
                    {this.renderButton('5', () => this.inputNumber('5'))}
                    {this.renderButton('6', () => this.inputNumber('6'))}
                    {this.renderButton('−', () => this.inputOperation('-'), 'bg-blue-400 hover:bg-blue-500 text-white')}

                    {/* Row 4 */}
                    {this.renderButton('1', () => this.inputNumber('1'))}
                    {this.renderButton('2', () => this.inputNumber('2'))}
                    {this.renderButton('3', () => this.inputNumber('3'))}
                    {this.renderButton('+', () => this.inputOperation('+'), 'bg-blue-400 hover:bg-blue-500 text-white row-span-2')}

                    {/* Row 5 */}
                    {this.renderButton('0', () => this.inputNumber('0'), 'col-span-2')}
                    {this.renderButton('.', this.inputDecimal)}
                    {this.renderButton('=', this.calculate, 'bg-green-500 hover:bg-green-600 text-white')}
                </div>

                {/* Footer */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    Use keyboard for input • ESC to clear • Enter for equals
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