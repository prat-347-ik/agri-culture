import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const Home = () => {
  const { t } = useTranslation(); // 2. Initialize hook

  // --- Inline Styles (remain the same) ---
  const pageStyle = {
    minHeight: '100vh',
    padding: '40px',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    flexDirection: 'column',
    boxSizing: 'border-box',
  };
  const gridContainerStyle = {
    position: 'relative',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    flex: 1,
    alignContent: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  };
  const cardStyle = {
    background: '#fff',
    padding: '40px 30px',
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
    minHeight: '250px',
    cursor: 'pointer',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  };
  const cardIconStyle = {
    fontSize: '3rem',
    marginBottom: '15px',
    color: '#2e7d32', // Green icon color
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
  // --- End Inline Styles ---

  // --- MOVED THIS BLOCK INSIDE THE COMPONENT ---
  // Add hover effects through inline styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .home-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
      }
      @media (max-width: 768px) {
        .home-card {
          margin: 0 10px;
        }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);
  // --- END OF MOVED BLOCK ---

  return (
    <div style={pageStyle}>
      <div style={gridContainerStyle}>
        {/* Card 1: Map */}
        <Link to="/map" style={cardStyle} className="home-card"> {/* Added class for potential CSS hover */}
          <div style={cardIconStyle}>🗺️</div>
          <h3 style={cardTitleStyle}>{t('home.map_title')}</h3> {/* Translate */}
          <p style={cardDescriptionStyle}>{t('home.map_description')}</p> {/* Translate */}
        </Link>

        {/* Card 2: Marketplace */}
        <Link to="/marketplace" style={cardStyle} className="home-card">
          <div style={cardIconStyle}>🛒</div>
          <h3 style={cardTitleStyle}>{t('home.marketplace_title')}</h3> {/* Translate */}
          <p style={cardDescriptionStyle}>{t('home.marketplace_description')}</p> {/* Translate */}
        </Link>
        
        {/* Card 3: Enroll Services */}
        <Link to="/enroll" style={cardStyle} className="home-card">
          <div style={cardIconStyle}>📝</div>
          <h3 style={cardTitleStyle}>{t('home.enroll_title')}</h3> {/* Translate */}
          <p style={cardDescriptionStyle}>{t('home.enroll_description')}</p> {/* Translate */}
        </Link>

        {/* Card 4: Weather & Services (links to /etc) */}
        <Link to="/etc" style={cardStyle} className="home-card">
          <div style={cardIconStyle}>☀️</div>
          <h3 style={cardTitleStyle}>{t('home.etc_title')}</h3> {/* Translate */}
          <p style={cardDescriptionStyle}>{t('home.etc_description')}</p> {/* Translate */}
        </Link>
      </div>
    </div>
  );
};

export default Home;