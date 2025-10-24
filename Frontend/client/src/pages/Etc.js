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

          <div className="service-card">
            <h3>{t('etc.calendar_title', 'Crop Calendar')}</h3> {/* 3. Translate */}
            <p>{t('etc.calendar_desc', 'Plan your farming activities')}</p> {/* 3. Translate */}
            <div className="calendar-widget">
              <div className="calendar-info">
                {/* These are just placeholders, but you could translate them too if needed */}
                <span className="month">December</span>
                <span className="crop">Wheat Season</span>
              </div>
              <Link to="/contacts?service=calendar" className="service-btn">
                {t('etc.calendar_button', 'View Calendar')} {/* 3. Translate */}
              </Link>
            </div>
          </div>

          <div className="service-card">
            <h3>{t('etc.price_title', 'Price Updates')}</h3> {/* 3. Translate */}
            <p>{t('etc.price_desc', 'Latest market prices for crops')}</p> {/* 3. Translate */}
            <div className="price-widget">
              <div className="price-info">
                {/* These are just placeholders */}
                <span className="crop-price">Wheat: ₹2,100/qt</span>
                <span className="trend">↑ +5%</span>
              </div>
              <button className="service-btn">{t('etc.price_button', 'View Prices')}</button> {/* 3. Translate */}
            </div>
          </div>

          <div className="service-card">
            <h3>{t('etc.expert_title', 'Expert Advice')}</h3> {/* 3. Translate */}
            <p>{t('etc.expert_desc', 'Connect with our AI agricultural expert')}</p> {/* 3. Translate */}
            <Chatbot />
          </div>

          {/* --- THIS BLOCK IS UPDATED --- */}
          <div className="service-card">
            <h3>{t('etc.training_title', 'Training Programs')}</h3> {/* 3. Translate */}
            <p>{t('etc.training_desc', 'Learn modern farming techniques')}</p> {/* 3. Translate */}
            <div className="training-widget">
              {/* ... widget info ... */}
              <Link to="/training-programs" className="service-btn"> {/* <-- 1. LINK UPDATED */}
                {t('etc.training_button', 'Browse Courses')} {/* <-- 2. DEFAULT TEXT UPDATED */}
              </Link>
            </div>
          </div>
          {/* --- END OF UPDATE --- */}

          <div className="service-card">
            <h3>{t('etc.insurance_title', 'Insurance Services')}</h3> {/* 3. Translate */}
            <p>{t('etc.insurance_desc', 'Protect your crops and equipment')}</p> {/* 3. Translate */}
            <div className="insurance-widget">
              {/* ... widget info ... */}
              <Link to="/contacts?service=insurance" className="service-btn">
                {t('etc.insurance_button', 'Get Quote')} {/* 3. Translate */}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etc;
