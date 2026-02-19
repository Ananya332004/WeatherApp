export default function ErrorDisplay({ message, onRetry }) {
    return (
        <div className="error-container" id="error-display">
            <div className="error-icon">⚠️</div>
            <h2 className="error-title">Oops! Something went wrong</h2>
            <p className="error-message">{message || 'Unable to fetch weather data. Please try again later.'}</p>
            {onRetry && (
                <button className="error-retry-btn" onClick={onRetry} id="error-retry-btn">
                    Try Again
                </button>
            )}
        </div>
    );
}
