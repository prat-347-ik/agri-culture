import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="menu-text">Menu</div>
      <nav className="sidebar-nav">
        <ul>
          <li><Link to="/" className="nav-link active">Home</Link></li>
          <li><Link to="/map" className="nav-link">Map</Link></li>
          <li><Link to="/marketplace" className="nav-link">Market</Link></li>
          <li><Link to="/enroll" className="nav-link">Enroll Services</Link></li>
          <li><Link to="/contacts" className="nav-link">Contacts</Link></li>
          <li><Link to="/profile" className="nav-link">Profile</Link></li>
          <li><Link to="/etc" className="nav-link">etc</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;