import { useState } from 'react';
import { FiMapPin, FiGlobe, FiClock } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { getLocationAutocomplete } from '../services/weatherService';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

export default function AutocompletePage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searched, setSearched] = useState(false);
    const navigate = useNavigate();

    const searchLocations = async (query) => {
        setLoading(true);
        setError(null);
        setSearched(true);

        try {
            const data = await getLocationAutocomplete(query);
            setResults(data.results || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationClick = (location) => {
        navigate(`/?city=${encodeURIComponent(location.name + ', ' + location.country)}`);
    };

    return (
        <div id="autocomplete-page">
            <div className="page-header">
                <h1 className="page-title">Location Lookup</h1>
                <p className="page-subtitle">
                    Search and discover locations worldwide with autocomplete
                </p>
            </div>

            <div className="info-banner">
                <FiMapPin className="info-banner-icon" />
                <span>
                    Location autocomplete is available on Standard Plan and higher. Click any result to view its weather.
                </span>
            </div>

            <SearchBar
                onSearch={searchLocations}
                placeholder="Type a city name to find matching locations..."
            />

            {loading && <LoadingSpinner text="Searching locations..." />}

            {error && (
                <ErrorDisplay message={error} onRetry={() => { }} />
            )}

            {!loading && !error && results.length > 0 && (
                <div className="location-results" id="location-results">
                    {results.map((loc, index) => (
                        <div
                            key={`${loc.name}-${loc.lat}-${index}`}
                            className="location-card glass-card"
                            onClick={() => handleLocationClick(loc)}
                            id={`location-card-${index}`}
                        >
                            <div className="location-card-name">
                                <FiMapPin style={{ marginRight: '6px', color: 'var(--color-primary-light)' }} />
                                {loc.name}
                            </div>
                            <div className="location-card-country">
                                {loc.region && `${loc.region}, `}{loc.country}
                            </div>
                            <div className="location-card-details">
                                <span>
                                    <FiGlobe />
                                    {loc.lat}°, {loc.lon}°
                                </span>
                                <span>
                                    <FiClock />
                                    UTC {loc.utc_offset >= 0 ? '+' : ''}{loc.utc_offset}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && searched && results.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-icon">🔍</div>
                    <h2 className="empty-state-title">No locations found</h2>
                    <p className="empty-state-text">
                        Try a different search term or check the spelling
                    </p>
                </div>
            )}

            {!loading && !error && !searched && (
                <div className="empty-state">
                    <div className="empty-state-icon">🗺️</div>
                    <h2 className="empty-state-title">Discover Locations</h2>
                    <p className="empty-state-text">
                        Start typing a city name to see matching locations from around the world
                    </p>
                </div>
            )}
        </div>
    );
}
