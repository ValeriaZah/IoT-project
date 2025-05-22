import React, { useState } from 'react';
import '../styles.css';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState({
    tempMin: 86,
    tempMax: 122,
    co2Min: 86,
    co2Max: 122,
    humidityMin: 86,
    humidityMax: 122,
    refreshRate: 86,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
  try {
    await axios.post('https://wildfireeye.onrender.com/api/settings', settings);
    alert('Settings saved!');
  } catch (error) {
    console.error('Error saving settings:', error);
    alert('Error saving settings');
  }
};

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      <div className="setting-group">
        <h3>Temperature</h3>
        <label>
          min °F
          <input type="number" name="tempMin" value={settings.tempMin} onChange={handleChange} />
        </label>
        <label>
          max °F
          <input type="number" name="tempMax" value={settings.tempMax} onChange={handleChange} />
        </label>
      </div>

      <div className="setting-group">
        <h3>CO2</h3>
        <label>
          min ppm
          <input type="number" name="co2Min" value={settings.co2Min} onChange={handleChange} />
        </label>
        <label>
          max ppm
          <input type="number" name="co2Max" value={settings.co2Max} onChange={handleChange} />
        </label>
      </div>

      <div className="setting-group">
        <h3>Humidity</h3>
        <label>
          min %
          <input type="number" name="humidityMin" value={settings.humidityMin} onChange={handleChange} />
        </label>
        <label>
          max %
          <input type="number" name="humidityMax" value={settings.humidityMax} onChange={handleChange} />
        </label>
      </div>

      <div className="setting-group">
        <h3>Refresh Rate</h3>
        <input type="number" name="refreshRate" value={settings.refreshRate} onChange={handleChange} /> minutes
      </div>
      <button className="confirm-button" onClick={handleSave}>Confirm</button>
    </div>
  );
};

export default Settings;