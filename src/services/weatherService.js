import { API_KEY, BASE_URL } from '../config/api';

/**
 * Generic fetch handler with error management
 */
async function apiFetch(endpoint, params = {}) {
    const queryParams = new URLSearchParams({
        access_key: API_KEY,
        ...params,
    });

    const url = `${BASE_URL}/${endpoint}?${queryParams.toString()}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.success === false) {
            throw new Error(data.error?.info || 'An unknown API error occurred');
        }

        return data;
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error);
        throw error;
    }
}

/**
 * Get current/real-time weather for a location
 * Endpoint: /current
 */
export async function getCurrentWeather(query, units = 'm') {
    return apiFetch('current', { query, units });
}

/**
 * Get historical weather data for a location on a specific date
 * Endpoint: /historical
 * Date format: YYYY-MM-DD
 */
export async function getHistoricalWeather(query, historicalDate, units = 'm', hourly = 1, interval = 3) {
    return apiFetch('historical', {
        query,
        historical_date: historicalDate,
        units,
        hourly,
        interval,
    });
}

/**
 * Get weather forecast data for a location
 * Endpoint: /forecast
 * forecast_days: 1-14
 */
export async function getWeatherForecast(query, forecastDays = 7, units = 'm', hourly = 1, interval = 3) {
    return apiFetch('forecast', {
        query,
        forecast_days: forecastDays,
        units,
        hourly,
        interval,
    });
}

/**
 * Location autocomplete/lookup
 * Endpoint: /autocomplete
 */
export async function getLocationAutocomplete(query) {
    return apiFetch('autocomplete', { query });
}

/**
 * Get marine weather data
 * Endpoint: /marine
 * Requires latitude and longitude
 */
export async function getMarineWeather(latitude, longitude, units = 'm', hourly = 1, tide = 'yes') {
    return apiFetch('marine', {
        latitude,
        longitude,
        units,
        hourly,
        tide,
    });
}
