import { useState } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { WiDayFog } from 'react-icons/wi';
import { getWeatherForecast } from '../services/weatherService';
import SearchBar from '../components/SearchBar';
import WeatherDetailsGrid from '../components/WeatherDetailsGrid';
import AstroSection from '../components/AstroSection';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

function formatTime(timeStr) {
    const h = Math.floor(parseInt(timeStr, 10) / 100);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:00 ${ampm}`;
}

export default function ForecastPage() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchedCity, setSearchedCity] = useState('');
    const [forecastDays, setForecastDays] = useState(7);
    const [selectedDay, setSelectedDay] = useState(null);

    const fetchForecast = async (city) => {
        if (!city) return;
        setLoading(true);
        setError(null);
        setSearchedCity(city);
        setSelectedDay(null);

        try {
            const data = await getWeatherForecast(city, forecastDays);
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const forecastEntries = weatherData?.forecast
        ? Object.entries(weatherData.forecast)
        : [];

    const selectedDayData = selectedDay
        ? weatherData?.forecast?.[selectedDay]
        : null;

    return (
        <div id="forecast-page">
            <div className="page-header">
                <h1 className="page-title">Weather Forecast</h1>
                <p className="page-subtitle">
                    Up to 14-day weather forecast with hourly details
                </p>
            </div>

            <div className="info-banner">
                <WiDayFog className="info-banner-icon" />
                <span>
                    Weather forecasts up to 14 days. Requires Professional Plan or higher.
                </span>
            </div>

            <SearchBar onSearch={fetchForecast} placeholder="Search city for weather forecast..." />

            <div className="historical-controls">
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        Forecast Days:
                    </label>
                    <div className="unit-toggle">
                        {[1, 3, 7, 14].map((d) => (
                            <button
                                key={d}
                                className={`unit-toggle-btn ${forecastDays === d ? 'active' : ''}`}
                                onClick={() => setForecastDays(d)}
                            >
                                {d}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    className="search-btn"
                    onClick={() => fetchForecast(searchedCity)}
                    disabled={!searchedCity}
                    style={{ opacity: !searchedCity ? 0.5 : 1 }}
                    id="forecast-fetch-btn"
                >
                    Update Forecast
                </button>
            </div>

            {loading && <LoadingSpinner text="Loading forecast data..." />}

            {error && (
                <ErrorDisplay message={error} onRetry={() => fetchForecast(searchedCity)} />
            )}

            {!loading && !error && weatherData && (
                <>
                    {/* Current Weather */}
                    <div className="weather-hero">
                        <div className="weather-main-card glass-card glass-card--no-hover" id="forecast-current-card">
                            <div className="weather-location">
                                <FiMapPin className="weather-location-icon" />
                                <span className="weather-location-name">{weatherData.location?.name}</span>
                                <span className="weather-location-region">{weatherData.location?.country}</span>
                            </div>
                            <div className="weather-temp-display">
                                <span className="weather-temp">{weatherData.current?.temperature}</span>
                                <span className="weather-temp-unit">°C</span>
                            </div>
                            <div className="weather-desc-row">
                                {weatherData.current?.weather_icons?.[0] && (
                                    <img src={weatherData.current.weather_icons[0]} alt="" className="weather-icon" />
                                )}
                                <div>
                                    <div className="weather-description">
                                        {weatherData.current?.weather_descriptions?.[0]}
                                    </div>
                                    <div className="weather-feels-like">Current Conditions</div>
                                </div>
                            </div>
                        </div>
                        <WeatherDetailsGrid current={weatherData.current} />
                    </div>

                    {/* Forecast Cards */}
                    <h3 className="section-title">
                        <span className="section-title-icon">📆</span>
                        {forecastDays}-Day Forecast
                    </h3>

                    <div className="forecast-grid">
                        {forecastEntries.map(([dateKey, day]) => {
                            const dateObj = new Date(dateKey + 'T00:00:00');
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const firstHour = day.hourly?.[0];
                            const isSelected = selectedDay === dateKey;

                            return (
                                <div
                                    key={dateKey}
                                    className={`forecast-card glass-card ${isSelected ? 'glass-card--strong' : ''}`}
                                    onClick={() => setSelectedDay(isSelected ? null : dateKey)}
                                    style={{ cursor: 'pointer', border: isSelected ? '1px solid var(--color-primary-light)' : undefined }}
                                    id={`forecast-card-${dateKey}`}
                                >
                                    <div className="forecast-card-date">
                                        {dayName} · {dateStr}
                                    </div>

                                    {firstHour?.weather_icons?.[0] && (
                                        <img src={firstHour.weather_icons[0]} alt="" className="forecast-card-icon" />
                                    )}

                                    <div className="forecast-card-desc">
                                        {firstHour?.weather_descriptions?.[0] || 'N/A'}
                                    </div>

                                    <div className="forecast-card-temps">
                                        <span className="forecast-temp-high">{day.maxtemp}°</span>
                                        <span className="forecast-temp-low">{day.mintemp}°</span>
                                    </div>

                                    <div className="forecast-card-details">
                                        <div>
                                            <div className="forecast-detail-label">UV</div>
                                            <div className="forecast-detail-value">{day.uv_index}</div>
                                        </div>
                                        <div>
                                            <div className="forecast-detail-label">Sun</div>
                                            <div className="forecast-detail-value">{day.sunhour}h</div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Day Hourly */}
                    {selectedDayData && (
                        <div style={{ marginTop: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease-out' }}>
                            <h3 className="section-title">
                                <span className="section-title-icon">⏰</span>
                                Hourly Forecast — {new Date(selectedDay + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h3>

                            <div className="hourly-timeline">
                                {selectedDayData.hourly?.map((hour, hIdx) => (
                                    <div key={hIdx} className="hourly-item glass-card">
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

                            {selectedDayData.astro && (
                                <AstroSection astro={selectedDayData.astro} />
                            )}
                        </div>
                    )}
                </>
            )}

            {!loading && !error && !weatherData && (
                <div className="empty-state">
                    <div className="empty-state-icon">🌦️</div>
                    <h2 className="empty-state-title">Plan Ahead</h2>
                    <p className="empty-state-text">
                        Search for a city to see up to 14 days of weather forecasts
                    </p>
                </div>
            )}
        </div>
    );
}
