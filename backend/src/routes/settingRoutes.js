const express = require('express');
const router = express.Router();
const { getThresholds, updateThresholds } = require('../controllers/settingController');

router.get('/', getThresholds);
router.post('/', updateThresholds);

module.exports = router;