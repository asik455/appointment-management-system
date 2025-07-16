import React from 'react';
import './AboutPage.css';

const AboutPage = ({ onBack }) => (
  <div className="about-bg">
    <div className="about-card">
      <h2>About Appointment Pro</h2>
      <p>
        Appointment Pro is a modern, secure, and easy-to-use appointment management system. <br />
        Built with React, it helps you organize your schedule, manage clients, and never miss an important meeting—all without any backend or data leaving your device.
      </p>
      <button className="about-back-btn" onClick={onBack}>Back</button>
    </div>
  </div>
);

export default AboutPage; 