const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const alertRoutes = require('./routes/alertRoutes');
const testRoutes = require('./routes/testRoutes');
const firbasedataRoutes = require('./routes/firebaseDataRoutes');
const settingRoutes = require('./routes/settingRoutes');

const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Сначала API маршруты
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorDataRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/test', testRoutes);
app.use('/api/firebasedata', firbasedataRoutes);
app.use('/api/settings', settingRoutes);

// ✅ Потом статика
app.use(express.static(path.join(__dirname, '../frontend/build')));

// ✅ Потом всё остальное отдаёт index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

module.exports = app;