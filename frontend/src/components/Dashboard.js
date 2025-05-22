import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import '../styles.css';

const sensorIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1397/1397898.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const fireIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/785/785116.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const FixMapSize = () => {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
  }, [map]);
  return null;
};

const Dashboard = () => {
  const [mapPosition, setMapPosition] = useState('top');
  const [latestSensorData, setSensorData] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    axios.get('https://wildfireeye.onrender.com/api/firebasedata/monitoring')
      .then(res => setSensorData(res.data))
      .catch(err => console.error('Sensor data error:', err));

    axios.get('https://wildfireeye.onrender.com/api/firebasedata/alerts')
      .then(res => setAlerts(res.data))
      .catch(err => console.error('Alerts error:', err));
  }, []);

  const renderMap = () => (
    <MapContainer center={[50.880078, 14.249905]} zoom={13} style={{ height: '100%', width: '100%' }}>
      <FixMapSize />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {latestSensorData.map(sensor => (
        <Marker key={sensor._id} position={sensor.gps} icon={sensorIcon}>
          <Popup>
            Sensor {sensor.sensorId}<br />
            Temp: {sensor.temperature} °C<br />
            CO2: {sensor.co2Level} ppm
          </Popup>
        </Marker>
      ))}
      {alerts.map(alert => (
        <Marker key={alert._id} position={[alert.gps[0] + 0.001, alert.gps[1] + 0.001]} icon={fireIcon}>
          <Popup>
            <strong>{alert.type || 'Alert'}</strong><br />
            Sensor: {alert.sensorId}<br />
            Status: {alert.status}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="button-group">
          <button onClick={() => setMapPosition('top')} className='button'>Top</button>
          <button onClick={() => setMapPosition('hidden')} className='button'>Hide</button>
        </div>
      </div>

      {mapPosition === 'top' && <div className="dashboard-map-full">{renderMap()}</div>}

      <AlertsSection alerts={alerts} />
      <SensorDataSection data={latestSensorData} />
    </div>
  );
};

const AlertsSection = ({ alerts }) => (
  <section>
    <h3>🔥 Active Alerts</h3>
    {alerts.length === 0 ? (
      <p>No active alerts</p>
    ) : (
      <div className="grid">
        {alerts.map(alert => (
          <div className="card alert-card" key={alert._id}>
            <p><strong>Sensor:</strong> {alert.sensorId}</p>
            <p><strong>Status:</strong> {alert.status}</p>
            <p><strong>Time:</strong> {new Date(alert.dateTime).toLocaleString()}</p>
            <p><strong>GPS:</strong> {alert.gps.join(', ')}</p>
            <Link to={`/alerts/${alert._id}`} className="button-alert">More</Link>
          </div>
        ))}
      </div>
    )}
  </section>
);

const SensorDataSection = ({ data }) => (
  <section>
    <h3>📈 Latest Sensor Data</h3>
    <div className="grid">
      {data.map(sensor => (
       <div className="sensor-card" key={sensor._id}>
  <p><strong className="label">Sensor ID:</strong> <span className="value">{sensor.sensorId}</span></p>
  <p><strong className="label">📍 GPS:</strong> <span className="value">{sensor.gps.join(', ')}</span></p>
  <p><strong className="label">🌡 Temp:</strong> <span className="temp-value">{sensor.temperature}°C</span></p>
  <p><strong className="label">💧 Humidity:</strong> <span className="humidity-value">{sensor.humidity} %</span></p>
  <p><strong className="label">🟤 CO₂:</strong> <span className="co2-value">{sensor.co2Level} ppm</span></p>
  <p><strong className="label">🕓 Last updated:</strong><br />
    <span className="date-value">{new Date(sensor.dateTime).toLocaleString()}</span>
  </p>
  <Link to={`/monitoring/${sensor.sensorId}`} className="button">View Monitoring</Link>
</div>
      ))}
    </div>
  </section>
);

export default Dashboard;