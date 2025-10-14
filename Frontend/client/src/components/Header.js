import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const ProfileMenu = ({ user, onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="profile-menu" onMouseLeave={() => setIsOpen(false)}>
            <button className="profile-btn" onMouseEnter={() => setIsOpen(true)}>
                {/* Display the user's name, default to 'User' if not available */}
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
    const location = useLocation(); // Hook to get the current URL location

    // This effect will now re-run every time the page location changes
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('auth_verified') === '1';
        if (isLoggedIn) {
            // In a real app, you'd fetch user data. We'll use localStorage.
            const profile = JSON.parse(localStorage.getItem('profile'));
            setUser({ name: profile?.name });
        } else {
            // If not logged in, ensure user state is null
            setUser(null);
        }
    }, [location]); // The effect depends on the location now

    const handleLogout = () => {
        localStorage.removeItem('auth_verified');
        localStorage.removeItem('profile');
        localStorage.removeItem('auth_phone');
        setUser(null);
        navigate('/'); // Redirect to landing page on logout
    };

    return (
        <header>
            <Link to="/home" className="logo">Agri-Culture</Link>
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