export default function LoadingSpinner({ text = 'Fetching weather data...' }) {
    return (
        <div className="loading-container" id="loading-spinner">
            <div className="loading-spinner"></div>
            <p className="loading-text">{text}</p>
        </div>
    );
}
