import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
    WiDaySunny,
    WiTime4,
    WiDayFog,
    WiDirectionUp,
} from 'react-icons/wi';
import { FiMenu, FiX, FiMapPin, FiAnchor } from 'react-icons/fi';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Real-Time', icon: <WiDaySunny className="nav-link-icon" /> },
        { path: '/historical', label: 'Historical', icon: <WiTime4 className="nav-link-icon" /> },
        { path: '/forecast', label: 'Forecast', icon: <WiDayFog className="nav-link-icon" /> },
        { path: '/autocomplete', label: 'Locations', icon: <FiMapPin className="nav-link-icon" /> },
        { path: '/marine', label: 'Marine', icon: <FiAnchor className="nav-link-icon" /> },
    ];

    return (
        <nav className="navbar" id="main-navbar">
            <div className="navbar-inner">
                <Link to="/" className="navbar-brand" id="brand-logo">
                    <span className="navbar-brand-icon">⛅</span>
                    SkyPulse
                </Link>

                <button
                    className="navbar-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                    id="mobile-menu-toggle"
                >
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>

                <ul className={`navbar-links ${menuOpen ? 'open' : ''}`} id="nav-links">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    `nav-link ${isActive ? 'active' : ''}`
                                }
                                onClick={() => setMenuOpen(false)}
                                end={item.path === '/'}
                                id={`nav-${item.label.toLowerCase()}`}
                            >
                                {item.icon}
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
}
