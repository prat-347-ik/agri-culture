import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();

  // This function now works because your routes are at the root
  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="sidebar">
      <div className="menu-text">{t('sidebar.menu', 'Menu')}</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
              {t('sidebar.home', 'Home')}
            </Link>
          </li>
          <li>
            <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`}>
              {t('sidebar.map', 'Map')}
            </Link>
          </li>
          <li>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              {t('sidebar.marketplace', 'Marketplace')}
            </Link>
          </li>
          <li>
            <Link to="/enroll" className={`nav-link ${isActive('/enroll') ? 'active' : ''}`}>
              {t('sidebar.enroll', 'Enroll Services')}
            </Link>
          </li>
          <li>
            <Link to="/contacts" className={`nav-link ${isActive('/contacts') ? 'active' : ''}`}>
              {t('sidebar.contacts', 'Contacts')}
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              {t('sidebar.profile', 'Profile')}
            </Link>
          </li>
          <li>
            <Link to="/etc" className={`nav-link ${isActive('/etc') ? 'active' : ''}`}>
              {t('sidebar.etc', 'Additional Services')}
            </Link>
          </li>
          {/* We keep /settings as it's part of the new features */}
          <li>
            <Link to="/settings" className={`nav-link ${isActive('/settings') ? 'active' : ''}`}>
              {t('sidebar.settings', 'Settings')}
            </Link>
          </li>
        </ul>
      </nav>

    </aside>
  );
};

export default Sidebar;