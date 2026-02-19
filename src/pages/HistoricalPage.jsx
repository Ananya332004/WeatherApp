import { useState } from 'react';
import { FiMapPin, FiCalendar, FiClock } from 'react-icons/fi';
import { WiTime4 } from 'react-icons/wi';
import { getHistoricalWeather } from '../services/weatherService';
import SearchBar from '../components/SearchBar';
import WeatherDetailsGrid from '../components/WeatherDetailsGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

function formatTime(timeStr) {
    const hour = parseInt(timeStr, 10);
    const h = Math.floor(hour / 100);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:00 ${ampm}`;
}

export default function HistoricalPage() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [city, setCity] = useState('');
    const [date, setDate] = useState('');

    const fetchHistorical = async (searchCity) => {
        const targetCity = searchCity || city;
        if (!targetCity || !date) {
            setError('Please enter both a location and a date.');
            return;
        }
        setLoading(true);
        setError(null);
        setCity(targetCity);

        try {
            const data = await getHistoricalWeather(targetCity, date);
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const historicalDays = weatherData?.historical
        ? Object.values(weatherData.historical)
        : [];

    return (
        <div id="historical-page">
            <div className="page-header">
                <h1 className="page-title">Historical Weather</h1>
                <p className="page-subtitle">
                    Explore weather data from any date since 2008
                </p>
            </div>

            <div className="info-banner">
                <WiTime4 className="info-banner-icon" />
                <span>
                    Historical data is available from July 2008 onwards. Requires Standard Plan or higher.
                </span>
            </div>

            <SearchBar
                onSearch={(q) => {
                    setCity(q);
                    if (date) fetchHistorical(q);
                }}
                placeholder="Search city for historical weather..."
            />

            <div className="historical-controls">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FiCalendar style={{ color: 'var(--text-tertiary)' }} />
                    <input
                        type="date"
                        className="date-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        min="2008-07-01"
                        id="historical-date-input"
                    />
                </div>
                <button
                    className="search-btn"
                    onClick={() => fetchHistorical()}
                    disabled={!city || !date}
                    style={{ opacity: !city || !date ? 0.5 : 1 }}
                    id="historical-fetch-btn"
                >
                    <FiClock />
                    Fetch Historical Data
                </button>
            </div>

            {loading && <LoadingSpinner text="Loading historical data..." />}

            {error && (
                <ErrorDisplay
                    message={error}
                    onRetry={() => fetchHistorical()}
                />
            )}

            {!loading && !error && weatherData && (
                <>
                    {/* Current weather at the time of query */}
                    <div className="weather-hero">
                        <div className="weather-main-card glass-card glass-card--no-hover" id="historical-current-card">
                            <div className="weather-location">
                                <FiMapPin className="weather-location-icon" />
                                <span className="weather-location-name">
                                    {weatherData.location?.name}
                                </span>
                                <span className="weather-location-region">
                                    {weatherData.location?.country}
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
                                        alt="Weather"
                                        className="weather-icon"
                                    />
                                )}
                                <div>
                                    <div className="weather-description">
                                        {weatherData.current?.weather_descriptions?.[0]}
                                    </div>
                                    <div className="weather-feels-like">
                                        Current conditions at query time
                                    </div>
                                </div>
                            </div>
                        </div>

                        <WeatherDetailsGrid current={weatherData.current} />
                    </div>

                    {/* Historical Data */}
                    {historicalDays.map((day) => (
                        <div key={day.date} style={{ marginBottom: 'var(--space-xl)', animation: 'fadeInUp 0.5s ease-out 0.2s backwards' }}>
                            <h3 className="section-title">
                                <span className="section-title-icon">📅</span>
                                {new Date(day.date + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h3>

                            {/* Day Summary */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Avg Temp</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{day.avgtemp}°C</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>High</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#f87171' }}>{day.maxtemp}°C</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Low</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#38bdf8' }}>{day.mintemp}°C</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Sun Hours</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#fbbf24' }}>{day.sunhour}h</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>UV Index</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{day.uv_index}</div>
                                </div>
                                <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
                                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>Total Snow</div>
                                    <div style={{ fontSize: '1.3rem', fontWeight: 700, fontFamily: 'var(--font-heading)' }}>{day.totalsnow} cm</div>
                                </div>
                            </div>

                            {/* Hourly Breakdown */}
                            {day.hourly && day.hourly.length > 0 && (
                                <>
                                    <h3 className="section-title">
                                        <span className="section-title-icon">⏰</span>
                                        Hourly Breakdown
                                    </h3>
                                    <div className="hourly-timeline">
                                        {day.hourly.map((hour, hIdx) => (
                                            <div className="hourly-item glass-card" key={hIdx}>
                                                <div className="hourly-time">{formatTime(hour.time)}</div>
                                                {hour.weather_icons?.[0] && (
                                                    <img src={hour.weather_icons[0]} alt="" className="hourly-icon" />
                                                )}
                                                <div className="hourly-temp">{hour.temperature}°</div>
                                                {hour.chanceofrain > 0 && (
                                                    <div className="hourly-rain">💧 {hour.chanceofrain}%</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </>
            )}

            {!loading && !error && !weatherData && (
                <div className="empty-state">
                    <div className="empty-state-icon">📜</div>
                    <h2 className="empty-state-title">Explore the Past</h2>
                    <p className="empty-state-text">
                        Search for a city and select a date to view historical weather data
                    </p>
                </div>
            )}
        </div>
    );
}
