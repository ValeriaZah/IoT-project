const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const sensorDataRoutes = require('./routes/sensorDataRoutes');
const alertRoutes = require('./routes/alertRoutes');
const testRoutes = require('./routes/testRoutes');
const firbasedataRoutes = require('./routes/firebaseDataRoutes');
const settingRoutes = require('./routes/settingRoutes');

const app = express();

app.get('/', (req, res) => {
  res.send('🔥 Backend API is running!');
});

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sensors', sensorDataRoutes);
app.use('/api/alerts', alertRoutes);

app.use('/api/test', testRoutes);

app.use('/api/firebasedata', firbasedataRoutes);

app.use('/api/settings', settingRoutes);

module.exports = app;