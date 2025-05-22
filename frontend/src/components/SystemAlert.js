// SystemAlert.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';
import axios from 'axios';

const SystemAlert = () => {
  const [alerts, setAlerts] = useState([]);

   useEffect(() => {
    axios.get('http://localhost:5001/api/firebasedata/alerts')
      .then(res => setAlerts(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleConfirm = async (id) => {
    try {
      await axios.patch(`https://wildfireeye.onrender.com/api/firebasedata/alerts/${id}/confirm`);
      setAlerts(prev =>
        prev.map(a => a._id === id ? { ...a, confirmed: true, status: 'Confirmed' } : a)
      );
    } catch (err) {
      console.error('Error confirming alert:', err);
    }
  };

  return (
    <div className="system-alert-container">
      <h2>System Alert</h2>
      <div className="grid">
        {alerts.map(alert => (
         <div
              key={alert._id}
                className={`card ${
                alert.status === 'Warning'
                ? 'alert-card warning'
                : alert.status === 'Active'
                ? 'alert-card active'
                : 'alert-card neutral'
                }`}
>
            <p><strong>{alert.type}</strong> ID {alert.sensorId}</p>
            <p><strong>Date/Time</strong><br />{new Date(alert.dateTime).toLocaleString()}</p>
            <p><strong>GPS</strong><br />{alert.gps.join(', ')}</p>
            <p><strong>t°</strong><br />{alert.temperature} °C</p>
            <p><strong>Humidity</strong><br />{alert.humidity} %</p>
            <p><strong>CO2</strong><br />{alert.co2Level} ppm</p>
            <p><strong>System status</strong><br />{alert.status}</p>

            <div className="button-group">
              {!alert.confirmed ? (
                <>
                  <Link to={`/alerts/${alert._id}`} className="gray-button">More</Link>
                  <button className="gray-button" onClick={() => handleConfirm(alert._id)}>Confirm</button>
                </>
              ) : (
                <Link to={`/alerts/${alert._id}`} className="gray-button">Read More</Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SystemAlert;