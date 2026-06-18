import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">🏠 Rent<span>Ease</span></div>
            <p className="footer-desc">
              RentEase connects tenants with landlords across India. Find verified properties, book visits, and manage your rental journey — all in one place.
            </p>
            <div style={{marginTop:16, display:'flex', gap:10}}>
              <a href="mailto:xyz@gmail.com" style={{color:'var(--accent-light)', fontSize:'0.85rem'}}>📧 xyz@gmail.com</a>
            </div>
            <div style={{marginTop:6}}>
              <span style={{color:'rgba(255,255,255,0.5)', fontSize:'0.85rem'}}>📞 +91-9000000000</span>
            </div>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/properties">Browse Properties</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4>For Tenants</h4>
            <ul>
              <li><Link to="/properties">Search Properties</Link></li>
              <li><Link to="/register">Create Account</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/tenant-dashboard">My Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4>For Landlords</h4>
            <ul>
              <li><Link to="/add-property">List Property</Link></li>
              <li><Link to="/landlord-dashboard">Manage Listings</Link></li>
              <li><Link to="/register">Register as Landlord</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="footer-credit">
            © 2024 RentEase. All rights reserved. | Designed & Developed by <strong>Saanvika</strong>
          </p>
          <p style={{fontSize:'0.75rem', color:'rgba(255,255,255,0.35)'}}>
            Built with React · Powered by JSON Server
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
