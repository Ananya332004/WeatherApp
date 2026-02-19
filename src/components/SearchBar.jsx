import { useState, useRef, useEffect, useCallback } from 'react';
import { FiSearch, FiMapPin } from 'react-icons/fi';
import { getLocationAutocomplete } from '../services/weatherService';

export default function SearchBar({ onSearch, placeholder = 'Search city, zip code, coordinates...' }) {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const debounceRef = useRef(null);
    const dropdownRef = useRef(null);

    const fetchSuggestions = useCallback(async (value) => {
        if (value.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        try {
            const data = await getLocationAutocomplete(value);
            if (data.results && data.results.length > 0) {
                setSuggestions(data.results);
                setShowDropdown(true);
            } else {
                setSuggestions([]);
                setShowDropdown(false);
            }
        } catch {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, []);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setQuery(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 350);
    };

    const handleSelectSuggestion = (suggestion) => {
        const searchQuery = `${suggestion.name}, ${suggestion.country}`;
        setQuery(searchQuery);
        setShowDropdown(false);
        setSuggestions([]);
        if (onSearch) onSearch(searchQuery);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            setShowDropdown(false);
            if (onSearch) onSearch(query.trim());
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="search-container" id="search-container">
            <form onSubmit={handleSubmit}>
                <div className="search-wrapper" ref={dropdownRef}>
                    <div className="search-input-group">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-input"
                            placeholder={placeholder}
                            value={query}
                            onChange={handleInputChange}
                            id="search-input"
                            autoComplete="off"
                        />
                        <button type="submit" className="search-btn" id="search-btn">
                            <FiSearch />
                            Search
                        </button>
                    </div>

                    {showDropdown && suggestions.length > 0 && (
                        <div className="autocomplete-dropdown" id="autocomplete-dropdown">
                            {suggestions.map((suggestion, index) => (
                                <div
                                    key={`${suggestion.name}-${suggestion.lat}-${index}`}
                                    className="autocomplete-item"
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    id={`autocomplete-item-${index}`}
                                >
                                    <FiMapPin className="autocomplete-item-icon" />
                                    <div className="autocomplete-item-info">
                                        <div className="autocomplete-item-name">{suggestion.name}</div>
                                        <div className="autocomplete-item-region">
                                            {suggestion.region}, {suggestion.country}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
