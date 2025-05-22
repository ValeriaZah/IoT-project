import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles.css';
import SensorChart from './SensorChart';

const MonitoringDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [sortOption, setSortOption] = useState('recent');
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    axios.get(`https://wildfireeye.onrender.com/api/firebasedata/monitoring/${id}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const getTimeLimit = () => {
    const now = new Date();
    switch (timeRange) {
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case 'today': return new Date(new Date().setHours(0, 0, 0, 0));
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
  };

  const filteredByTime = data.filter(item => new Date(item.dateTime) >= getTimeLimit());

  const sortData = (data, option) => {
    const sorted = [...data];
    switch (option) {
      case 'recent':
        return sorted.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
      case 'tempAsc':
        return sorted.sort((a, b) => a.temperature - b.temperature);
      case 'tempDesc':
        return sorted.sort((a, b) => b.temperature - a.temperature);
      case 'co2Asc':
        return sorted.sort((a, b) => a.co2Level - b.co2Level);
      case 'co2Desc':
        return sorted.sort((a, b) => b.co2Level - a.co2Level);
      case 'humidityAsc':
        return sorted.sort((a, b) => a.humidity - b.humidity);
      case 'humidityDesc':
        return sorted.sort((a, b) => b.humidity - a.humidity);
      default:
        return sorted;
    }
  };

  const filteredData = sortData(filteredByTime, sortOption);

  if (data.length === 0) {
    return <div>No data for sensor ID {id}</div>;
  }

  return (
    <div className="container">
      <h2>Sensor Monitoring – ID: {id}</h2>

      <div className="sort-panel">
        <label>Time Range:</label>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}>
          <option value="24h">Last 24h</option>
          <option value="today">Today</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>

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

      

      <table className="sensor-table">
        <thead>
          <tr>
            <th>GPS Coordinates</th>
            <th>Temperature</th>
            <th>CO2 Level</th>
            <th>Humidity</th>
            <th>System Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item._id}>
              <td>{item.gps.join(', ')}</td>
              <td><span className="temp-value">{item.temperature} °F</span></td>
<td><span className="co2-value">{item.co2Level} ppm</span></td>
<td><span className="humidity-value">{item.humidity} %</span></td>
              <td>{item.status || 'N/A'}</td>
              <td>{new Date(item.dateTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <SensorChart data={filteredData} />
      <Link to="/dashboard" className="gray-button">← Back</Link>
    </div>
  );
};

export default MonitoringDetail;