import { useState } from 'react';
import { FiAnchor, FiNavigation } from 'react-icons/fi';
import { getMarineWeather } from '../services/weatherService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

function formatTime(timeStr) {
    const h = Math.floor(parseInt(timeStr, 10) / 100);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${displayH}:00 ${ampm}`;
}

export default function MarinePage() {
    const [latitude, setLatitude] = useState('45.00');
    const [longitude, setLongitude] = useState('-2.00');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

    const fetchMarine = async (e) => {
        e?.preventDefault();
        if (!latitude || !longitude) {
            setError('Please enter both latitude and longitude.');
            return;
        }
        setLoading(true);
        setError(null);
        setSelectedDay(null);

        try {
            const data = await getMarineWeather(latitude, longitude);
            setWeatherData(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const forecastArr = weatherData?.forecast || [];
    const selectedDayData = selectedDay !== null ? forecastArr[selectedDay] : null;

    return (
        <div id="marine-page">
            <div className="page-header">
                <h1 className="page-title">Marine Weather</h1>
                <p className="page-subtitle">
                    Live marine conditions, swell data, tides, and 7-day marine forecast
                </p>
            </div>

            <div className="info-banner">
                <FiAnchor className="info-banner-icon" />
                <span>
                    Marine weather data is available on Standard Plan and higher. Enter coordinates for ocean locations.
                </span>
            </div>

            <form onSubmit={fetchMarine}>
                <div className="marine-input-group">
                    <input
                        type="number"
                        step="any"
                        className="marine-input"
                        placeholder="Latitude (e.g., 45.00)"
                        value={latitude}
                        onChange={(e) => setLatitude(e.target.value)}
                        id="marine-lat-input"
                    />
                    <input
                        type="number"
                        step="any"
                        className="marine-input"
                        placeholder="Longitude (e.g., -2.00)"
                        value={longitude}
                        onChange={(e) => setLongitude(e.target.value)}
                        id="marine-lon-input"
                    />
                    <button type="submit" className="marine-submit" id="marine-fetch-btn">
                        <FiNavigation />
                        Get Marine Data
                    </button>
                </div>
            </form>

            {loading && <LoadingSpinner text="Loading marine data..." />}

            {error && (
                <ErrorDisplay message={error} onRetry={fetchMarine} />
            )}

            {!loading && !error && weatherData && forecastArr.length > 0 && (
                <>
                    {/* Forecast Day Cards */}
                    <h3 className="section-title">
                        <span className="section-title-icon">🌊</span>
                        Marine Forecast
                    </h3>

                    <div className="forecast-grid">
                        {forecastArr.map((day, idx) => {
                            const dateObj = new Date(day.date + 'T00:00:00');
                            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const firstHour = day.hourly?.[0];
                            const isSelected = selectedDay === idx;

                            return (
                                <div
                                    key={day.date}
                                    className={`forecast-card glass-card ${isSelected ? 'glass-card--strong' : ''}`}
                                    onClick={() => setSelectedDay(isSelected ? null : idx)}
                                    style={{ cursor: 'pointer', border: isSelected ? '1px solid var(--color-accent)' : undefined }}
                                    id={`marine-day-${idx}`}
                                >
                                    <div className="forecast-card-date">{dayName} · {dateStr}</div>

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

                                    {firstHour && (
                                        <div className="forecast-card-details">
                                            <div>
                                                <div className="forecast-detail-label">Swell</div>
                                                <div className="forecast-detail-value">{firstHour.swell_height}m</div>
                                            </div>
                                            <div>
                                                <div className="forecast-detail-label">Water</div>
                                                <div className="forecast-detail-value">{firstHour.water_temp}°C</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected Day Details */}
                    {selectedDayData && (
                        <div style={{ marginTop: 'var(--space-xl)', animation: 'fadeInUp 0.4s ease-out' }}>
                            <h3 className="section-title">
                                <span className="section-title-icon">📊</span>
                                Details — {new Date(selectedDayData.date + 'T00:00:00').toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </h3>

                            {/* Marine Data Summary */}
                            {selectedDayData.hourly?.[0] && (
                                <div className="marine-data-grid">
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">🌊</div>
                                        <div className="marine-data-item-label">Swell Height</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].swell_height} m</div>
                                    </div>
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">📐</div>
                                        <div className="marine-data-item-label">Sig Wave Height</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].sig_height_m} m</div>
                                    </div>
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">🧭</div>
                                        <div className="marine-data-item-label">Swell Direction</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].swell_dir_16_point} ({selectedDayData.hourly[0].swell_dir}°)</div>
                                    </div>
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">⏱️</div>
                                        <div className="marine-data-item-label">Swell Period</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].swell_period_secs}s</div>
                                    </div>
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">🌡️</div>
                                        <div className="marine-data-item-label">Water Temp</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].water_temp}°C</div>
                                    </div>
                                    <div className="marine-data-item glass-card">
                                        <div className="marine-data-item-icon">💨</div>
                                        <div className="marine-data-item-label">Wind Speed</div>
                                        <div className="marine-data-item-value">{selectedDayData.hourly[0].wind_speed} km/h</div>
                                    </div>
                                </div>
                            )}

                            {/* Tides */}
                            {selectedDayData.tides && selectedDayData.tides.length > 0 && (
                                <>
                                    <h3 className="section-title">
                                        <span className="section-title-icon">🌊</span>
                                        Tide Schedule
                                    </h3>
                                    <div className="glass-card glass-card--no-hover" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-xl)', overflow: 'auto' }}>
                                        <table className="tide-table" id="tide-table">
                                            <thead>
                                                <tr>
                                                    <th>Type</th>
                                                    <th>Time</th>
                                                    <th>Height</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedDayData.tides.map((tide, tIdx) => (
                                                    <tr key={tIdx}>
                                                        <td>
                                                            <span className={`tide-badge ${tide.tide_type === 'HIGH' ? 'tide-badge--high' : 'tide-badge--low'}`}>
                                                                {tide.tide_type}
                                                            </span>
                                                        </td>
                                                        <td>{tide.tideTime}</td>
                                                        <td>{tide.tideHeight_mt} m</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}

                            {/* Hourly Marine */}
                            {selectedDayData.hourly && (
                                <>
                                    <h3 className="section-title">
                                        <span className="section-title-icon">⏰</span>
                                        Hourly Conditions
                                    </h3>
                                    <div className="hourly-timeline">
                                        {selectedDayData.hourly.map((hour, hIdx) => (
                                            <div key={hIdx} className="hourly-item glass-card" style={{ minWidth: '120px' }}>
                                                <div className="hourly-time">{formatTime(hour.time)}</div>
                                                {hour.weather_icons?.[0] && (
                                                    <img src={hour.weather_icons[0]} alt="" className="hourly-icon" />
                                                )}
                                                <div className="hourly-temp">{hour.temperature}°</div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--color-accent)', marginTop: '4px' }}>
                                                    🌊 {hour.swell_height}m
                                                </div>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                    💧 {hour.water_temp}°C
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* Astronomy */}
                            {selectedDayData.astro && (
                                <div style={{ marginTop: 'var(--space-lg)' }}>
                                    <h3 className="section-title">
                                        <span className="section-title-icon">🌌</span>
                                        Astronomy
                                    </h3>
                                    <div className="astro-grid">
                                        {[
                                            { icon: '🌅', label: 'Sunrise', value: selectedDayData.astro.sunrise },
                                            { icon: '🌇', label: 'Sunset', value: selectedDayData.astro.sunset },
                                            { icon: '🌙', label: 'Moonrise', value: selectedDayData.astro.moonrise },
                                            { icon: '🌑', label: 'Moonset', value: selectedDayData.astro.moonset },
                                            { icon: '🌓', label: 'Phase', value: selectedDayData.astro.moon_phase },
                                        ].map((item) => (
                                            <div className="astro-item glass-card" key={item.label}>
                                                <div className="astro-item-icon">{item.icon}</div>
                                                <div className="astro-item-label">{item.label}</div>
                                                <div className="astro-item-value">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {!loading && !error && !weatherData && (
                <div className="empty-state">
                    <div className="empty-state-icon">⚓</div>
                    <h2 className="empty-state-title">Marine Conditions</h2>
                    <p className="empty-state-text">
                        Enter ocean coordinates to get swell data, tide schedules, and marine forecasts
                    </p>
                </div>
            )}
        </div>
    );
}
