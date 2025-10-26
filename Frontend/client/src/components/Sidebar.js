import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';
import useAuth from '../hooks/useAuth';
import { 
  FaHome, 
  FaMapMarkedAlt, 
  FaStore, 
  FaTasks, 
  FaAddressBook, 
  FaUser, 
  FaCog,
  FaPlusCircle,
  FaArrowLeft // --- 1. CHANGED: New Icon Import ---
} from 'react-icons/fa';

// --- START: Updated Component Signature ---
const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
// --- END: Updated Component Signature ---
  const { t } = useTranslation();
  // --- REMOVED: useAuth and logout (wasnt used) ---
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  // --- REMOVED: handleLogout (wasnt used) ---

  // --- START: Added Handler ---
  // Closes sidebar on link click (for mobile)
  const handleLinkClick = () => {
    if (isSidebarOpen) {
      toggleSidebar();
    }
  };

  
  // --- END: Added Handler ---

  return (
    // --- START: Added ARIA Roles ---
    <aside 
      className="sidebar" 
      role="navigation" 
      aria-label="Main navigation"
    >
    {/* --- END: Added ARIA Roles --- */}

    {/* --- START: Added Close Button --- */}
    <button className="sidebar-close-btn" onClick={toggleSidebar} aria-label="Close menu">
      <FaArrowLeft /> {/* --- 2. CHANGED: New Icon Used Here --- */}
    </button>
    {/* --- END: Added Close Button --- */}

      <nav className="sidebar-nav">
        <ul>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaHome /> {t('sidebar.home', 'Home')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaMapMarkedAlt /> {t('sidebar.map', 'Map')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaStore /> {t('sidebar.marketplace', 'Marketplace')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/enroll" className={`nav-link ${isActive('/enroll') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaTasks /> {t('sidebar.enroll', 'Enroll Services')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/contacts" className={`nav-link ${isActive('/contacts') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaAddressBook /> {t('sidebar.contacts', 'Contacts')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaUser /> {t('sidebar.profile', 'Profile')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/etc" className={`nav-link ${isActive('/etc') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaPlusCircle /> {t('sidebar.etc', 'Additional Services')}
            </Link>
          </li>
          <li>
            {/* --- START: Added onClick --- */}
            <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`} onClick={handleLinkClick}>
            {/* --- END: Added onClick --- */}
              <FaCog /> {t('sidebar.settings', 'Settings')}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;