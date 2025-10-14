import React from 'react';

const Etc = () => {
  return (
    <div className="content-inner">
      <div className="content-section">
        <h2>Additional Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Weather Forecast</h3>
            <p>Get daily weather updates for your area</p>
            <div className="weather-widget">
              <div className="weather-info">
                <span className="temp">28°C</span>
                <span className="condition">Sunny</span>
              </div>
              <button className="service-btn">View Details</button>
            </div>
          </div>

          <div className="service-card">
            <h3>Crop Calendar</h3>
            <p>Plan your farming activities</p>
            <div className="calendar-widget">
              <div className="calendar-info">
                <span className="month">December</span>
                <span className="crop">Wheat Season</span>
              </div>
              <button className="service-btn">View Calendar</button>
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
            <p>Connect with agricultural experts</p>
            <div className="expert-widget">
              <div className="expert-info">
                <span className="expert-name">Dr. Sharma</span>
                <span className="expert-specialty">Soil Expert</span>
              </div>
              <button className="service-btn">Chat Now</button>
            </div>
          </div>

          <div className="service-card">
            <h3>Training Programs</h3>
            <p>Learn modern farming techniques</p>
            <div className="training-widget">
              <div className="training-info">
                <span className="course">Organic Farming</span>
                <span className="duration">2 weeks</span>
              </div>
              <button className="service-btn">Enroll Now</button>
            </div>
          </div>

          <div className="service-card">
            <h3>Insurance Services</h3>
            <p>Protect your crops and equipment</p>
            <div className="insurance-widget">
              <div className="insurance-info">
                <span className="coverage">Crop Insurance</span>
                <span className="premium">₹500/year</span>
              </div>
              <button className="service-btn">Get Quote</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Etc;