import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for internal navigation

const Home = () => {
  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Welcome to Agri-Culture</h2>
        <p className="welcome-subtitle">Connecting Farmers for a Better Tomorrow</p>
        <div className="welcome-cards">
          <div className="welcome-card">
            <h3>Map</h3>
            <p>Explore local farms and agricultural areas</p>
            <Link to="/map" className="card-link">View Map</Link>
          </div>
          <div className="welcome-card">
            <h3>Market</h3>
            <p>Buy, bid, and rent agricultural equipment</p>
            <Link to="/marketplace" className="card-link">Visit Market</Link>
          </div>
          <div className="welcome-card">
            <h3>Contacts</h3>
            <p>Important contacts for farmers</p>
            <Link to="/contacts" className="card-link">View Contacts</Link>
          </div>
          <div className="welcome-card">
            <h3>Profile</h3>
            <p>Create or update your profile to personalize the app</p>
            <Link to="/login" className="card-link">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;