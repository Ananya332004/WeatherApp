function getAQILabel(epaIndex) {
    const labels = {
        1: { text: 'Good', className: 'aqi-badge--good' },
        2: { text: 'Moderate', className: 'aqi-badge--moderate' },
        3: { text: 'Unhealthy (Sensitive)', className: 'aqi-badge--unhealthy' },
        4: { text: 'Unhealthy', className: 'aqi-badge--unhealthy' },
        5: { text: 'Very Unhealthy', className: 'aqi-badge--unhealthy' },
        6: { text: 'Hazardous', className: 'aqi-badge--unhealthy' },
    };
    return labels[epaIndex] || { text: 'Unknown', className: 'aqi-badge--moderate' };
}

export default function AirQualitySection({ airQuality }) {
    if (!airQuality) return null;

    const epa = getAQILabel(Number(airQuality['us-epa-index']));

    const pollutants = [
        { label: 'CO', value: airQuality.co, unit: 'μg/m³' },
        { label: 'NO₂', value: airQuality.no2, unit: 'μg/m³' },
        { label: 'O₃', value: airQuality.o3, unit: 'μg/m³' },
        { label: 'SO₂', value: airQuality.so2, unit: 'μg/m³' },
        { label: 'PM2.5', value: airQuality.pm2_5, unit: 'μg/m³' },
        { label: 'PM10', value: airQuality.pm10, unit: 'μg/m³' },
    ];

    return (
        <div className="air-quality-section" id="air-quality-section">
            <h3 className="section-title">
                <span className="section-title-icon">🌬️</span>
                Air Quality
                <span className={`aqi-badge ${epa.className}`}>
                    EPA: {epa.text}
                </span>
            </h3>
            <div className="air-quality-grid">
                {pollutants.map((item) => (
                    <div className="air-quality-item glass-card" key={item.label}>
                        <div className="air-quality-label">{item.label}</div>
                        <div className="air-quality-value">
                            {parseFloat(item.value).toFixed(1)}
                        </div>
                        <div className="air-quality-unit">{item.unit}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
