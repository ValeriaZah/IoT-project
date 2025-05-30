const express = require('express');
const router = express.Router();
const { createSensorData, getSensorData, getSensorDataById } = require('../controllers/sensorDataController');

router.post('/', createSensorData);
router.get('/', getSensorData); // 🔥 добавь это
router.get('/:id', getSensorDataById); // 🔥 добавь это
module.exports = router;