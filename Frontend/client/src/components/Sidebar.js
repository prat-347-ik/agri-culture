import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  FaSignOutAlt // --- START: Added Import ---
} from 'react-icons/fa';
// --- END: Added Import ---

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    // --- START: Added ARIA Roles ---
    <aside 
      className="sidebar" 
      role="navigation" 
      aria-label="Main navigation"
    >
    {/* --- END: Added ARIA Roles --- */}

    

      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
              <FaHome /> {t('sidebar.home', 'Home')}
            </Link>
          </li>
          <li>
            <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`}>
              <FaMapMarkedAlt /> {t('sidebar.map', 'Map')}
            </Link>
          </li>
          <li>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              <FaStore /> {t('sidebar.marketplace', 'Marketplace')}
            </Link>
          </li>
          <li>
            <Link to="/enroll" className={`nav-link ${isActive('/enroll') ? 'active' : ''}`}>
              <FaTasks /> {t('sidebar.enroll', 'Enroll Services')}
            </Link>
          </li>
          <li>
            <Link to="/contacts" className={`nav-link ${isActive('/contacts') ? 'active' : ''}`}>
              <FaAddressBook /> {t('sidebar.contacts', 'Contacts')}
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              <FaUser /> {t('sidebar.profile', 'Profile')}
            </Link>
          </li>
          <li>
            <Link to="/etc" className={`nav-link ${isActive('/etc') ? 'active' : ''}`}>
              <FaPlusCircle /> {t('sidebar.etc', 'Additional Services')}
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
              <FaCog /> {t('sidebar.settings', 'Settings')}
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;