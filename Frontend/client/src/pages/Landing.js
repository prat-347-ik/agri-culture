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
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main className="landing-main">
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Agri-Culture</h1>
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
            Agri-Culture is a digital platform designed to empower farmers by connecting them with the resources, information, and markets they need to thrive. We believe in leveraging technology to build a stronger, more sustainable agricultural community.
          </p>
        </section>

        <section id="mission" className="landing-section">
          <h2>Our Mission</h2>
          <p>
            Our mission is to bridge the gap between traditional farming and modern technology. We aim to provide a comprehensive ecosystem that includes a marketplace for goods, a platform for services, and access to vital information like weather patterns and market prices, all in one accessible place.
          </p>
        </section>
      </main>

      <footer id="contact" className="landing-footer">
        <h2>Contact Us</h2>
        <p>Have questions? Reach out to us.</p>
        <p><strong>Email:</strong> contact@agri-culture.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p className="copyright">&copy; 2025 Agri-Culture. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;