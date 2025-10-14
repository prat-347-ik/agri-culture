import React from 'react';

const Header = () => {
  return (
    <header>
      <a href="/" className="logo">Agri-Culture</a>
      <div className="header-right">
        <select id="langSelect" className="lang-select" aria-label="Language">
          <option value="en">English</option>
          <option value="mr">मराठी</option>
        </select>
        <a href="/login" id="headerLoginLink" className="login-btn">Login</a>
      </div>
    </header>
  );
};

export default Header;