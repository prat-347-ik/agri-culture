import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // Refs for accessibility and click-outside
  const menuRef = useRef(null);
  const profileBtnRef = useRef(null); // Ref for the button
  const dropdownListRef = useRef(null); // Ref for the ul (dropdown list)


  React.useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');
  }, []);

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // --- START: Added A11y ---
  
  // Effect to manage focus when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      // Focus the first item (Link or Button) in the dropdown
      const firstItem = dropdownListRef.current?.querySelector('li > a, li > button');
      firstItem?.focus();
    }
    // Note: Focus return on close is handled by the handleKeyDown (for Esc)
    // or naturally by the browser (for click-outside).
  }, [isMenuOpen]);

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!isMenuOpen) return;

    const items = Array.from(
      dropdownListRef.current.querySelectorAll('li > a, li > button')
    );
    
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsMenuOpen(false);
      profileBtnRef.current?.focus(); // Return focus to button
    } 
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const activeIndex = items.findIndex(item => item === document.activeElement);
      const nextIndex = (activeIndex + 1) % items.length;
      items[nextIndex]?.focus();
    } 
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const activeIndex = items.findIndex(item => item === document.activeElement);
      const prevIndex = (activeIndex - 1 + items.length) % items.length;
      items[prevIndex]?.focus();
    }
  };
  // --- END: Added A11y ---


  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('auth_phone');
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

      <div className="auth-links">
        {isLoggedIn ? (
          // --- CHANGED --- Added onKeyDown handler
          <div 
            className="profile-menu" 
            ref={menuRef} 
            onKeyDown={handleKeyDown}
          >
            <button 
              ref={profileBtnRef} // Added ref
              onClick={toggleMenu} 
              className={`profile-btn ${isMenuOpen ? 'open' : ''}`}
              // --- START: Added A11y Attributes ---
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-controls="profile-dropdown-menu"
              // --- END: Added A11y Attributes ---
            >
              Profile
            </button>
            
            <ul 
              ref={dropdownListRef} // Added ref
              id="profile-dropdown-menu" // Added id for aria-controls
              className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}
            >
              <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
              <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        ) : (
          <>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;