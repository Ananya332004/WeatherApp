import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiMapPin } from 'react-icons/fi';
import { getCurrentWeather } from '../services/weatherService';
import SearchBar from '../components/SearchBar';
import WeatherDetailsGrid from '../components/WeatherDetailsGrid';
import AstroSection from '../components/AstroSection';
import AirQualitySection from '../components/AirQualitySection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

export default function RealTimePage() {
    const [searchParams] = useSearchParams();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchedCity, setSearchedCity] = useState('');

    const fetchWeather = async (city) => {
        if (!city) return;
        setLoading(true);
        setError(null);
        setSearchedCity(city);

        try {
            const data = await getCurrentWeather(city);
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Load from URL param or default city
    useEffect(() => {
        const cityParam = searchParams.get('city');
        fetchWeather(cityParam || 'New Delhi');
    }, [searchParams]);

    return (
        <div id="realtime-page">
            <div className="page-header">
                <h1 className="page-title">Real-Time Weather</h1>
                <p className="page-subtitle">
                    Live weather conditions updated in real time
                </p>
            </div>

            <SearchBar onSearch={fetchWeather} placeholder="Search city for real-time weather..." />

            {loading && <LoadingSpinner />}

            {error && (
                <ErrorDisplay
                    message={error}
                    onRetry={() => fetchWeather(searchedCity)}
                />
            )}

            {!loading && !error && weatherData && (
                <>
                    {/* Main Weather Display */}
                    <div className="weather-hero">
                        {/* Temperature Card */}
                        <div className="weather-main-card glass-card glass-card--no-hover" id="main-weather-card">
                            <div className="weather-location">
                                <FiMapPin className="weather-location-icon" />
                                <span className="weather-location-name">
                                    {weatherData.location?.name}
                                </span>
                                <span className="weather-location-region">
                                    {weatherData.location?.region}, {weatherData.location?.country}
                                </span>
                            </div>

                            <div className="weather-temp-display">
                                <span className="weather-temp">
                                    {weatherData.current?.temperature}
                                </span>
                                <span className="weather-temp-unit">°C</span>
                            </div>

                            <div className="weather-desc-row">
                                {weatherData.current?.weather_icons?.[0] && (
                                    <img
                                        src={weatherData.current.weather_icons[0]}
                                        alt={weatherData.current.weather_descriptions?.[0] || 'Weather'}
                                        className="weather-icon"
                                    />
                                )}
                                <div>
                                    <div className="weather-description">
                                        {weatherData.current?.weather_descriptions?.[0]}
                                    </div>
                                    <div className="weather-feels-like">
                                        Feels like {weatherData.current?.feelslike}° · Observed at{' '}
                                        {weatherData.current?.observation_time}
                                    </div>
                                </div>
                            </div>

                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-md)' }}>
                                Local time: {weatherData.location?.localtime} · Timezone: {weatherData.location?.timezone_id}
                            </div>
                        </div>

                        {/* Details */}
                        <WeatherDetailsGrid current={weatherData.current} />
                    </div>

                    {/* Astronomy */}
                    {weatherData.current?.astro && (
                        <AstroSection astro={weatherData.current.astro} />
                    )}

                    {/* Air Quality */}
                    {weatherData.current?.air_quality && (
                        <AirQualitySection airQuality={weatherData.current.air_quality} />
                    )}
                </>
            )}

            {!loading && !error && !weatherData && (
                <div className="empty-state">
                    <div className="empty-state-icon">🌤️</div>
                    <h2 className="empty-state-title">Search for a location</h2>
                    <p className="empty-state-text">
                        Enter a city name, zip code, or coordinates to see real-time weather data
                    </p>
                </div>
            )}
        </div>
    );
}
