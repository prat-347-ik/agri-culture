import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav">
          <a href="#about">About Us</a>
          <a href="#mission">Our Mission</a>
          <a href="#features">Features</a>
          {/* --- ADDED --- */}
          <a href="#how-it-works">How It Works</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Agri-Cult</h1>
            <p className="hero-subtitle">
              Connecting Farmers for a Better Tomorrow.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="hero-btn primary">Login / Sign Up</Link>
            </div>
            <div className="admin-login-link">
              <Link to="/admin">Admin Login</Link>
            </div>
          </div>
        </section>

        <section id="about" className="landing-section">
          <h2>About Us</h2>
          <p>
            Agri-Cult is a digital platform designed to empower farmers by connecting them with the resources, information, and markets they need to thrive. We believe in leveraging technology to build a stronger, more sustainable agricultural community.
          </p>
        </section>

        <section id="mission" className="landing-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to bridge the gap between traditional farming and modern technology. We aim to provide a comprehensive ecosystem that includes a marketplace for goods, a platform for services, and access to vital information like weather patterns and market prices, all in one accessible place.
          </p>
        </section>

        <section id="features" className="landing-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Marketplace</h3>
              <p>Buy and sell produce, equipment, and livestock directly within the community.</p>
            </div>
            <div className="feature-card">
              <h3>Service Enrollment</h3>
              <p>Find and enroll in vital services like crop insurance, training programs, and equipment rental.</p>
            </div>
            <div className="feature-card">
              <h3>Data & Insights</h3>
              <p>Access real-time market prices, weather forecasts, and a personalized crop calendar.</p>
            </div>
            <div className="feature-card">
              <h3>Community Map</h3>
              <p>Locate nearby farms, service providers, and resources on an interactive community map.</p>
            </div>
          </div>
        </section>

        {/* --- START: ADDED "How It Works" Section --- */}
        <section id="how-it-works" className="landing-section">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-number">1</span>
              <h3>Create an Account</h3>
              <p>Sign up in seconds with just your phone number.</p>
            </div>
            <div className="step-card">
              <span className="step-number">2</span>
              <h3>Complete Your Profile</h3>
              <p>Tell us who you are (Farmer, Buyer, Service Provider) to personalize your experience.</p>
            </div>
            <div className="step-card">
              <span className="step-number">3</span>
              <h3>Explore & Connect</h3>
              <p>Access the marketplace, enroll in services, and connect with your community.</p>
            </div>
          </div>
        </section>
        {/* --- END: ADDED "How It Works" Section --- */}

      </main>

      <footer id="contact" className="landing-footer">
        <h2>Contact Us</h2>
        <p>Have questions? Reach out to us.</p>
        <p><strong>Email:</strong> contact@agri-cult.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p className="copyright">&copy; 2025 Agri-Cult. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;