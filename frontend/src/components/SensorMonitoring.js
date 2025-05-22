import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import L from 'leaflet';

const SensorMonitoring = () => {
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    axios.get('https://wildfireeye.onrender.com/api/firebasedata/monitoring')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, []);

  const sortData = (data, option) => {
    const sorted = [...data];
    switch (option) {
      case 'recent': return sorted.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      case 'oldest': return sorted.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      case 'tempAsc': return sorted.sort((a, b) => a.temperature - b.temperature);
      case 'tempDesc': return sorted.sort((a, b) => b.temperature - a.temperature);
      case 'co2Asc': return sorted.sort((a, b) => a.co2Level - b.co2Level);
      case 'co2Desc': return sorted.sort((a, b) => b.co2Level - a.co2Level);
      case 'humidityAsc': return sorted.sort((a, b) => a.humidity - b.humidity);
      case 'humidityDesc': return sorted.sort((a, b) => b.humidity - a.humidity);
      default: return sorted;
    }
  };

  const sortedData = sortData(data, sortOption);

  return (
    <div className="sensor-container">
      <h2>Sensor Monitoring</h2>

      {/* 🔘 Toggle map */}
      <div className="button-group">
        <button className="button" onClick={() => setShowMap(prev => !prev)}>
          {showMap ? 'Hide Map' : 'Show Map'}
        </button>
      </div>

      {showMap && (
        <div className="dashboard-map-full">
          <MapContainer
            center={[50.088, 14.42076]}
            zoom={8}
            scrollWheelZoom={false}
            className="leaflet-container"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {data.map((sensor) => (
  <CircleMarker
    key={sensor._id}
    center={sensor.gps}
    radius={8}
    pathOptions={{
      color: '#64829B',
      fillColor: '#A0C4DC',
      fillOpacity: 0.9,
      weight: 2,
    }}
  >
    <Popup>
      <strong>{sensor.sensorId}</strong><br />
      🌡 Temp: {sensor.temperature} °F<br />
      💧 Humidity: {sensor.humidity} %<br />
      🟤 CO₂: {sensor.co2Level} ppm
    </Popup>
  </CircleMarker>
))}
          </MapContainer>
        </div>
      )}

      {/* 🔽 Сортировка */}
      <div className="sort-panel">
        <label>Sort by:</label>
        <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="recent">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="tempAsc">Temperature: Low to High</option>
          <option value="tempDesc">Temperature: High to Low</option>
          <option value="co2Asc">CO2: Low to High</option>
          <option value="co2Desc">CO2: High to Low</option>
          <option value="humidityAsc">Humidity: Low to High</option>
          <option value="humidityDesc">Humidity: High to Low</option>
        </select>
      </div>

      {/* 🧾 Таблица */}
      <div className="table-wrapper">
        <table className="sensor-table">
          <thead>
            <tr>
              <th>Sensor ID</th>
              <th>GPS Coordinates</th>
              <th>Temperature</th>
              <th>CO2 Level</th>
              <th>Humidity</th>
              <th>System Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item._id}>
                <td>
                  <Link to={`/monitoring/${item.sensorId}`} className="sensor-link">{item.sensorId}</Link>
                </td>
                <td>{item.gps.join(', ')}</td>
                <td className="temp-value">{item.temperature} °F</td>
                <td className="co2-value">{item.co2Level} ppm</td>
                <td className="humidity-value">{item.humidity} %</td>
                <td>{item.status || 'N/A'}</td>
                <td>{new Date(item.dateTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorMonitoring;