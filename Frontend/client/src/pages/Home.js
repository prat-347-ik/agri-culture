import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  // --- Inline Styles for an attractive layout ---

  const pageStyle = {
    padding: '40px',
    backgroundColor: '#f9f9f9', // A slightly off-white background
  };






  const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Strict 2x2 grid
    gap: '30px', // Increased gap for better spacing
  };

  const cardStyle = {
    background: '#fff',
    padding: '30px',
    borderRadius: '15px',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    textAlign: 'center',
    textDecoration: 'none',
    color: 'inherit',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };
  
  // Note: Hover effects can't be done with inline styles. 
  // For a real hover effect, a CSS file or a library like styled-components is needed.
  // We'll rely on the transition to make it feel smooth if styles were external.

  const cardIconStyle = {
    fontSize: '3rem',
    marginBottom: '15px',
    color: '#2e7d32',
  };

  const cardTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '10px',
  };

  const cardDescriptionStyle = {
    color: '#666',
    lineHeight: '1.6',
  };


  return (
    <div style={pageStyle}>

      
      <div style={gridContainerStyle}>
        {/* Card 1: Map */}
        <Link to="/map" style={cardStyle}>
          <div style={cardIconStyle}>🗺️</div>
          <h3 style={cardTitleStyle}>Interactive Map</h3>
          <p style={cardDescriptionStyle}>Explore local farms, services, and points of interest in your area.</p>
        </Link>

        {/* Card 2: Marketplace */}
        <Link to="/marketplace" style={cardStyle}>
          <div style={cardIconStyle}>🛒</div>
          <h3 style={cardTitleStyle}>Marketplace</h3>
          <p style={cardDescriptionStyle}>Buy, bid on, or rent agricultural equipment, seeds, and produce.</p>
        </Link>
        
        {/* Card 3: Enroll Services (NEW) */}
        <Link to="/enroll" style={cardStyle}>
          <div style={cardIconStyle}>📝</div>
          <h3 style={cardTitleStyle}>Enroll Services</h3>
          <p style={cardDescriptionStyle}>Offer your own products or services to the community.</p>
        </Link>

        {/* Card 4: Weather (NEW) */}
        <Link to="/etc" style={cardStyle}>
          <div style={cardIconStyle}>☀️</div>
          <h3 style={cardTitleStyle}>Weather & Services</h3>
          <p style={cardDescriptionStyle}>Get the latest weather forecasts and access other essential services.</p>
        </Link>

      </div>
    </div>
  );
};

export default Home;