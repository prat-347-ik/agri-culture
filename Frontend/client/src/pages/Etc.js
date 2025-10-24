import React from 'react';
import { Link } from 'react-router-dom'; 
import Chatbot from '../components/Chatbot';
import WeatherWidget from '../components/WeatherWidget'; 
import { useTranslation } from 'react-i18next'; // 1. Import hook

const Etc = () => {
  const { t } = useTranslation(); // 2. Initialize hook

  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>{t('etc.title', 'Additional Services')}</h2> {/* 3. Translate */}
        <div className="services-grid">
          
            <div className="service-card">
              <h3>{t('etc.weather_title', 'Weather Forecast')}</h3> {/* 3. Translate */}
              <p>{t('etc.weather_desc', 'Get daily weather updates for your location')}</p> {/* 3. Translate */}
              <WeatherWidget />
            </div>

          {/* --- CROP CALENDAR CARD: Link correct --- */}
          <div className="service-card">
            <h3>{t('etc.calendar_title', 'Crop Calendar')}</h3> {/* 3. Translate */}
            <p>{t('etc.calendar_desc', 'Plan your farming activities')}</p> {/* 3. Translate */}
            <div className="calendar-widget">
              <div className="calendar-info">
                <span className="month">{t('etc.calendar_placeholder_month', 'December')}</span>
                <span className="crop">{t('etc.calendar_placeholder_crop', 'Wheat Season')}</span>
              </div>
              <Link to="/crop-calendar" className="service-btn"> 
                {t('etc.calendar_button', 'View Calendar')} {/* 3. Translate */}
              </Link>
            </div>
          </div>

          {/* --- PRICE UPDATES CARD: MODIFIED --- */}
          <div className="service-card">
            <h3>{t('etc.price_title', 'Price Updates')}</h3> {/* 3. Translate */}
            <p>{t('etc.price_desc', 'Latest market prices for crops')}</p> {/* 3. Translate */}
            <div className="price-widget">
              <div className="price-info">
                {/* These are just placeholders */}
                <span className="crop-price">{t('etc.price_placeholder_crop', 'Wheat: ₹2,100/qt')}</span>
                <span className="trend">{t('etc.price_placeholder_trend', '↑ +5%')}</span>
              </div>
              {/* --- THIS IS THE CHANGED LINE --- */}
              <Link to="/price-updates" className="service-btn">
                {t('etc.price_button', 'View Prices')}
              </Link>
              {/* --- END OF CHANGE --- */}
            </div>
          </div>

          <div className="service-card">
            <h3>{t('etc.expert_title', 'Expert Advice')}</h3> {/* 3. Translate */}
            <p>{t('etc.expert_desc', 'Connect with our AI agricultural expert')}</p> {/* 3. Translate */}
            <Chatbot />
          </div>

          {/* --- TRAINING PROGRAMS CARD: Re-added based on your code structure --- */}
           <div className="service-card">
            <h3>{t('sidebar_training', 'Training Programs')}</h3> 
            <p>{t('etc.training_desc', 'Browse and enroll in courses')}</p> 
            <div className="price-widget"> {/* You can rename this class if needed */ }
              <div className="price-info">
                <span className="crop-price">{t('etc.training_placeholder', 'New: Drip Irrigation')}</span>
              </div>
              <Link to="/training-programs" className="service-btn">
                {t('etc.training_button', 'View Programs')}
              </Link>
            </div>
          </div>

          {/* --- INSURANCE CARD: Link updated --- */}
          <div className="service-card">
            <h3>{t('etc.insurance_title', 'Insurance Services')}</h3> {/* 3. Translate */}
            <p>{t('etc.insurance_desc', 'Protect your crops and equipment')}</p> {/* 3. Translate */}
            <div className="insurance-widget">
              <div className="insurance-info" style={{ paddingBottom: '10px', fontSize: '0.9rem', color: '#34495e' }}>
                {t('etc.insurance_placeholder', 'PM Fasal Bima Yojana')}
              </div>
              <Link to="/insurance" className="service-btn"> {/* <-- LINK UPDATED */}
                {t('etc.insurance_button', 'Browse Plans')} {/* <-- Text updated */}
              </Link>
            </div>
          </div>
          {/* --- END OF UPDATE --- */}

        </div>
      </div>
    </div>
  );
};

export default Etc;