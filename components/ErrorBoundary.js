import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        
        // Log error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('ErrorBoundary caught an error:', error);
            console.error('Error info:', errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center h-full bg-ub-cool-grey text-white p-4">
                    <div className="bg-red-600 bg-opacity-20 border border-red-500 rounded-lg p-6 max-w-md w-full">
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mr-3">
                                <span className="text-white font-bold text-sm">!</span>
                            </div>
                            <h2 className="text-lg font-semibold text-red-300">
                                Something went wrong
                            </h2>
                        </div>
                        <p className="text-gray-300 mb-4">
                            {this.props.fallbackMessage || 'An unexpected error occurred in this component.'}
                        </p>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null, errorInfo: null });
                                if (this.props.onRetry) {
                                    this.props.onRetry();
                                }
                            }}
                            className="bg-ub-orange hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors"
                        >
                            Try Again
                        </button>
                        
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mt-4 text-xs">
                                <summary className="cursor-pointer text-red-300 hover:text-red-200">
                                    Show Error Details
                                </summary>
                                <pre className="mt-2 p-2 bg-black bg-opacity-50 rounded text-red-200 overflow-auto max-h-32">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

ErrorBoundary.propTypes = {
    children: PropTypes.node.isRequired,
    fallbackMessage: PropTypes.string,
    onRetry: PropTypes.func,
};

ErrorBoundary.defaultProps = {
    fallbackMessage: null,
    onRetry: null,
};

export default ErrorBoundary;