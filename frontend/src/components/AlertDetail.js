// AlertDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';

const AlertDetail = () => {
  const { id } = useParams();
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://wildfireeye.onrender.com/api/firebasedata/alerts')
      .then(res => {
        const found = res.data.find(a => a._id === id);
        setAlert(found || null);
      })
      .catch(err => console.error('Failed to load alert:', err));
  }, [id]);

  const updateAlertStatus = async (newStatus) => {
    try {
      await axios.patch(`https://wildfireeye.onrender.com/api/firebasedata/alerts/${id}`, { status: newStatus });
      setAlert(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      console.error('Failed to update alert status:', err);
    }
  };

  if (!alert) return <div className="alert-detail-wrapper"><h2>Alert not found</h2></div>;

  return (
    <div className="alert-detail-wrapper">
      <h2 className="alert-heading">🚨 Alert Detail</h2>

      <div className={`alert-card status-${alert.status}`}>
        <p><strong>📌 Type:</strong> {alert.type}</p>
        <p><strong>🔖 ID:</strong> {alert.sensorId}</p>
        <p><strong>🕓 Date/Time:</strong> {new Date(alert.dateTime).toLocaleString()}</p>
        <p><strong>📍 GPS:</strong> {alert.gps.join(', ')}</p>
        <p><strong>🌡 Temperature:</strong> {alert.temperature} °C</p>
        <p><strong>💧 Humidity:</strong> {alert.humidity} %</p>
        <p><strong>🟤 CO2 Level:</strong> {alert.co2Level} ppm</p>
        <p><strong>✅ Status:</strong> <span className={`status-label ${alert.status}`}>{alert.status}</span></p>
        <p><strong>📝 Description:</strong> {alert.description || '–'}</p>
      </div>

      <div className="button-group">
        <Link to="/alerts" className="button">← Back</Link>
        <Link to={`/monitoring/${alert.sensorId}`} className="button">View Monitoring</Link>
        {alert.status !== 'confirmed' && <button onClick={() => updateAlertStatus('confirmed')} className="button">Confirm</button>}
        {alert.status !== 'archived' && <button onClick={() => updateAlertStatus('archived')} className="button">Archive</button>}
      </div>
    </div>
  );
};

export default AlertDetail;
