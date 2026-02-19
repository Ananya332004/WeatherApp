export default function AstroSection({ astro }) {
    if (!astro) return null;

    const items = [
        { icon: '🌅', label: 'Sunrise', value: astro.sunrise },
        { icon: '🌇', label: 'Sunset', value: astro.sunset },
        { icon: '🌙', label: 'Moonrise', value: astro.moonrise },
        { icon: '🌑', label: 'Moonset', value: astro.moonset },
        { icon: '🌓', label: 'Moon Phase', value: astro.moon_phase },
        { icon: '✨', label: 'Illumination', value: `${astro.moon_illumination}%` },
    ];

    return (
        <div className="astro-section" id="astro-section">
            <h3 className="section-title">
                <span className="section-title-icon">🌌</span>
                Astronomy
            </h3>
            <div className="astro-grid">
                {items.map((item) => (
                    <div className="astro-item glass-card" key={item.label}>
                        <div className="astro-item-icon">{item.icon}</div>
                        <div className="astro-item-label">{item.label}</div>
                        <div className="astro-item-value">{item.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
