import React from 'react';
import { Link } from 'react-router-dom'; 
import Chatbot from '../components/Chatbot';
import WeatherWidget from '../components/WeatherWidget'; 

const Etc = () => {
  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Additional Services</h2>
        <div className="services-grid">
          
           <div className="service-card">
            <h3>Weather Forecast</h3>
            {/* --- UPDATED TEXT --- */}
            <p>Get daily weather updates for your location</p>
            <WeatherWidget />
          </div>

          <div className="service-card">
            <h3>Crop Calendar</h3>
            <p>Plan your farming activities</p>
            <div className="calendar-widget">
              <div className="calendar-info">
                <span className="month">December</span>
                <span className="crop">Wheat Season</span>
              </div>
              {/* --- CORRECTED LINK --- */}
              <Link to="/contacts?service=calendar" className="service-btn">
                View Calendar
              </Link>
            </div>
          </div>

          <div className="service-card">
            <h3>Price Updates</h3>
            <p>Latest market prices for crops</p>
            <div className="price-widget">
              <div className="price-info">
                <span className="crop-price">Wheat: ₹2,100/qt</span>
                <span className="trend">↑ +5%</span>
              </div>
              <button className="service-btn">View Prices</button>
            </div>
          </div>

          <div className="service-card">
            <h3>Expert Advice</h3>
            <p>Connect with our AI agricultural expert</p>
            <Chatbot />
          </div>

          <div className="service-card">
            <h3>Training Programs</h3>
            <p>Learn modern farming techniques</p>
            <div className="training-widget">
              {/* ... widget info ... */}
              <Link to="/contacts?service=training" className="service-btn">Enroll Now</Link>
            </div>
          </div>

          <div className="service-card">
            <h3>Insurance Services</h3>
            <p>Protect your crops and equipment</p>
            <div className="insurance-widget">
              {/* ... widget info ... */}
              <Link to="/contacts?service=insurance" className="service-btn">Get Quote</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etc;