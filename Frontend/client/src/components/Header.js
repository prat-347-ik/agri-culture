import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; // This import is already here
import './Header.css';

// --- 1. ACCEPT toggleSidebar AS A PROP ---
const Header = ({ toggleSidebar }) => {
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
      // Focus the first item in the dropdown
      dropdownListRef.current?.querySelector('a, button')?.focus();
    }
  }, [isMenuOpen]);

  // Keyboard navigation
  const handleKeyDown = (event) => {
    if (!isMenuOpen) return;

    const items = Array.from(dropdownListRef.current.querySelectorAll('a, button'));
    const activeIndex = items.findIndex(item => item === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (activeIndex + 1) % items.length;
      items[nextIndex].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (activeIndex - 1 + items.length) % items.length;
      items[prevIndex].focus();
    } else if (event.key === 'Escape') {
      setIsMenuOpen(false);
      profileBtnRef.current.focus(); // Return focus to the button
    } else if (event.key === 'Tab') {
      // Close menu on tab away
      setIsMenuOpen(false);
    }
  };
  // --- END: Added A11y ---

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.setItem('isLoggedIn', 'false');
    setIsLoggedIn(false);
    setIsMenuOpen(false); 
    // You might want to navigate to home/login page here
    // e.g., navigate('/login');
  };

  return (
    // --- 2. ADDED THE HAMBURGER BUTTON ---
    <header className="header" role="banner">
      <button 
        className="header-menu-toggle" 
        onClick={toggleSidebar}
        aria-label="Open navigation menu"
      >
        <FaBars />
      </button>
      {/* --- END OF ADDED BUTTON --- */}

      <div className="logo">
        Agri-Cult
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
              // --- START: Added A11y Attributes ---\
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