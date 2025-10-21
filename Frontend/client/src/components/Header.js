import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  // This state will be derived from localStorage on component mount
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  React.useEffect(() => {
    // CORRECTED: Check for the 'isLoggedIn' flag instead of the token
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  const handleLogout = async () => {
    try {
      // Call the backend logout endpoint to clear the httpOnly cookie
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        // IMPORTANT: This ensures the browser sends the cookie
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // Always clear frontend session state regardless of backend response
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('auth_phone');
      // Redirect to login and refresh the application state
      window.location.href = '/login';
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Agri-Culture</Link>
      </div>
      
      {/* Navigation can be added here if needed */}
      {/* <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          ... other links
        </ul>
      </nav> 
      */}

      <div className="auth-links">
        {isLoggedIn ? (
          <div className="profile-menu">
            <button onClick={toggleMenu} className="profile-btn">
              Profile
            </button>
            {isMenuOpen && (
              <ul className="dropdown-menu">
                <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
                <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </ul>
            )}
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
            {/* The sign-up is now part of the login page, so this can be removed if desired */}
            {/* <Link to="/signup">Sign Up</Link> */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;