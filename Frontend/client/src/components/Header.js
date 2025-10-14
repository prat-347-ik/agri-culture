import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import logo from '../logo.svg'; // Imports the logo.svg file from the src folder

const ProfileMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="profile-menu" onMouseLeave={() => setIsOpen(false)}>
            <button className="profile-btn" onMouseEnter={() => setIsOpen(true)}>
                {user.name || 'User'}
            </button>
            {isOpen && (
                <div className="profile-dropdown">
                    <Link to="/profile" className="dropdown-item">Profile</Link>
                    <Link to="/settings" className="dropdown-item">Settings</Link>
                    <button onClick={onLogout} className="dropdown-item logout-btn">Logout</button>
                </div>
            )}
        </div>
    );
};

const Header = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('auth_verified') === '1';
        if (isLoggedIn) {
            const profile = JSON.parse(localStorage.getItem('profile'));
            setUser({ name: profile?.name });
        } else {
            setUser(null);
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('auth_verified');
        localStorage.removeItem('profile');
        localStorage.removeItem('auth_phone');
        setUser(null);
        navigate('/');
    };

    return (
        <header>
            {/* The text logo is now replaced with this image logo */}
            <Link to="/home" className="logo-link">
                <img src={logo} alt="Agri-Culture Logo" className="logo-img" />
            </Link>
            
            <div className="header-right">
                <select id="langSelect" className="lang-select" aria-label="Language">
                    <option value="en">English</option>
                    <option value="mr">मराठी</option>
                </select>
                {user ? (
                    <ProfileMenu user={user} onLogout={handleLogout} />
                ) : (
                    <Link to="/login" className="login-btn">Login</Link>
                )}
            </div>
        </header>
    );
};

export default Header;