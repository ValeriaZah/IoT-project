import React from 'react';
import '../styles.css';
import { useTheme } from '../styles/ThemeProvider'; // если используешь свой ThemeProvider

const HomePage = () => {
  const { isDarkMode } = useTheme(); // глобальный флаг темы

  return (
    <div className={`home-container ${isDarkMode ? 'dark' : ''}`}>
      <header className="home-header">
        <h1>Welcome to WildfireEye</h1>
        <p>Your intelligent wildfire detection and sensor monitoring platform</p>
      </header>

      <section className="features-section">
        <div className="feature-card">
          <h2>🔥 Real-Time Alerts</h2>
          <p>Get instant notifications when temperature, CO₂ or humidity exceed safety limits.</p>
        </div>
        <div className="feature-card">
          <h2>📍 Sensor Map</h2>
          <p>Track environmental data and sensor status directly on an interactive map.</p>
        </div>
        <div className="feature-card">
          <h2>📊 Data Insights</h2>
          <p>Explore detailed logs and charts to analyze trends over time.</p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;