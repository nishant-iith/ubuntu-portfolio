import 'tailwindcss/tailwind.css'
import '../styles/index.css'
import ErrorBoundary from '../components/ErrorBoundary'

/**
 * Main App component with ErrorBoundary wrapper
 * Catches and handles runtime errors gracefully
 */
function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary
      fallbackMessage="Oops! Something went wrong with the portfolio. Please refresh the page."
      onRetry={() => window.location.reload()}
    >
      <Component {...pageProps} />
    </ErrorBoundary>
  )
}

export default MyApp
