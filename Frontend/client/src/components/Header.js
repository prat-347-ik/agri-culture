import React, { useState, useEffect, useRef } from 'react';
// --- 1. Import useNavigate instead of Navigate ---
import { Link, useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa'; 
import './Header.css';

const Header = ({ toggleSidebar }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  
  // --- 2. Initialize the navigate hook ---
  const navigate = useNavigate();
  
  // Refs for accessibility and click-outside
  const menuRef = useRef(null);
  const profileBtnRef = useRef(null); 
  const dropdownListRef = useRef(null); 


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

  
  // Effect to manage focus when menu opens
  useEffect(() => {
    if (isMenuOpen) {
      // Focus the first item in the dropdown
      dropdownListRef.current?.querySelector('a, button')?.focus();
    }
  }, [isMenuOpen]);


  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };
  
  // --- 3. This is the new handleLogout function ---
  const handleLogout = () => {
    // Clear user session
    localStorage.setItem('isLoggedIn', 'false');
    // You might want to clear other items too
    // localStorage.removeItem('accessToken');
    // localStorage.removeItem('user');

    setIsLoggedIn(false);
    setIsMenuOpen(false); // Close the profile menu
    
    // Redirect to the landing page
    navigate('/'); 
  };
  // --- END ---

  // Keyboard navigation for menu
  const handleKeyDown = (event) => {
    if (!isMenuOpen) return;

    const focusableElements = Array.from(
      dropdownListRef.current.querySelectorAll('a, button')
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const currentElement = document.activeElement;
    const currentIndex = focusableElements.indexOf(currentElement);

    if (event.key === 'Escape') {
      setIsMenuOpen(false);
      profileBtnRef.current?.focus();
      return;
    }
    
    if (event.key === 'Tab') {
      if (event.shiftKey) { // Shift + Tab
        if (currentElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else { // Tab
        if (currentElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
      // Note: Default tab behavior within the menu is preserved
      // if not on the first or last element.
    }
    
    if (event.key === 'ArrowDown') {
       event.preventDefault();
       const nextIndex = (currentIndex + 1) % focusableElements.length;
       focusableElements[nextIndex].focus();
    }
    
    if (event.key === 'ArrowUp') {
       event.preventDefault();
       const prevIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
       focusableElements[prevIndex].focus();
    }
    
     if (event.key === 'Home') {
        event.preventDefault();
        firstElement.focus();
    }

    if (event.key === 'End') {
        event.preventDefault();
        lastElement.focus();
    }
  };


  return (
    <header className="header">
      {/* --- 4. USE toggleSidebar PROP --- */}
      <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle navigation menu">
        <FaBars />
      </button>
      
      <div className="logo">
        Agri-Cult
      </div>

      <div className="auth-links">
        {isLoggedIn ? (
          <div 
            className="profile-menu" 
            ref={menuRef} 
            onKeyDown={handleKeyDown}
          >
            <button 
              ref={profileBtnRef} 
              onClick={toggleMenu} 
              className={`profile-btn ${isMenuOpen ? 'open' : ''}`}
              aria-haspopup="true"
              aria-expanded={isMenuOpen}
              aria-controls="profile-dropdown-menu"
            >
              Profile
            </button>
            
            <ul 
              ref={dropdownListRef} 
              id="profile-dropdown-menu" 
              className={`dropdown-menu ${isMenuOpen ? 'open' : ''}`}
            >
              <li><Link to="/profile" onClick={() => setIsMenuOpen(false)}>My Profile</Link></li>
              <li><Link to="/settings" onClick={() => setIsMenuOpen(false)}>Settings</Link></li>
              {/* This button now correctly calls the new handleLogout function */}
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