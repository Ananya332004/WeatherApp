import {
    WiStrongWind,
    WiHumidity,
    WiBarometer,
    WiDaySunny,
    WiCloud,
    WiRaindrop,
    WiThermometer,
} from 'react-icons/wi';
import { FiEye } from 'react-icons/fi';

export default function WeatherDetailsGrid({ current }) {
    if (!current) return null;

    const details = [
        {
            icon: <WiStrongWind />,
            iconClass: 'weather-detail-icon--wind',
            label: 'Wind',
            value: `${current.wind_speed} km/h ${current.wind_dir}`,
        },
        {
            icon: <WiHumidity />,
            iconClass: 'weather-detail-icon--humidity',
            label: 'Humidity',
            value: `${current.humidity}%`,
        },
        {
            icon: <WiBarometer />,
            iconClass: 'weather-detail-icon--pressure',
            label: 'Pressure',
            value: `${current.pressure} mb`,
        },
        {
            icon: <FiEye />,
            iconClass: 'weather-detail-icon--visibility',
            label: 'Visibility',
            value: `${current.visibility} km`,
        },
        {
            icon: <WiDaySunny />,
            iconClass: 'weather-detail-icon--uv',
            label: 'UV Index',
            value: current.uv_index,
        },
        {
            icon: <WiCloud />,
            iconClass: 'weather-detail-icon--cloud',
            label: 'Cloud Cover',
            value: `${current.cloudcover}%`,
        },
        {
            icon: <WiRaindrop />,
            iconClass: 'weather-detail-icon--precip',
            label: 'Precipitation',
            value: `${current.precip} mm`,
        },
        {
            icon: <WiThermometer />,
            iconClass: 'weather-detail-icon--feelslike',
            label: 'Feels Like',
            value: `${current.feelslike}°`,
        },
    ];

    return (
        <div className="weather-details-card glass-card glass-card--no-hover" id="weather-details">
            <h3 className="section-title">
                <span className="section-title-icon">📊</span>
                Weather Details
            </h3>
            <div className="weather-details-grid">
                {details.map((item) => (
                    <div className="weather-detail-item" key={item.label}>
                        <div className={`weather-detail-icon ${item.iconClass}`}>
                            {item.icon}
                        </div>
                        <div>
                            <div className="weather-detail-label">{item.label}</div>
                            <div className="weather-detail-value">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
