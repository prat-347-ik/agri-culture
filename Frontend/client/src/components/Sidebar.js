import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation(); // This hook gets the current page's URL information

  // A helper function to check if a link's path matches the current page's path
  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="menu-text">Menu</div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            {/* The 'active' class is now applied conditionally */}
            <Link to="/home" className={`nav-link ${isActive('/home') ? 'active' : ''}`}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/map" className={`nav-link ${isActive('/map') ? 'active' : ''}`}>
              Map
            </Link>
          </li>
          <li>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              Market
            </Link>
          </li>
          <li>
            <Link to="/enroll" className={`nav-link ${isActive('/enroll') ? 'active' : ''}`}>
              Enroll Services
            </Link>
          </li>
          <li>
            <Link to="/contacts" className={`nav-link ${isActive('/contacts') ? 'active' : ''}`}>
              Contacts
            </Link>
          </li>
          <li>
            <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
              Profile
            </Link>
          </li>
          <li>
            <Link to="/etc" className={`nav-link ${isActive('/etc') ? 'active' : ''}`}>
              etc
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;