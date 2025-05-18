const express = require('express');
const router = express.Router();
const db = require('../firebase');


router.get('/alerts', async (req, res) => {
  try {
    const snapshot = await db.collection('alerts').orderBy('dateTime', 'desc').get();
    const alerts = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching alerts', error: err });
  }
});


router.get('/monitoring', async (req, res) => {
  try {
    const snapshot = await db.collection('sensors').orderBy('dateTime', 'desc').get();
    const sensors = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(sensors);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching monitoring data', error: err });
  }
});


router.get('/monitoring/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await db.collection('sensors')
      .where('sensorId', '==', id)
      .orderBy('dateTime', 'desc')
      .limit(30)
      .get();
    const data = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching sensor details', error: err });
  }
});


router.patch('/alerts/:id/confirm', async (req, res) => {
  const { id } = req.params;
  try {
    const alertRef = db.collection('alerts').doc(id);
    await alertRef.update({
      confirmed: true,
      status: 'Confirmed'
    });
    res.json({ message: 'Alert confirmed' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to confirm alert', error: err });
  }
});


async function getThresholds() {
  const snap = await db.collection('config').doc('thresholds').get();
  return snap.exists ? snap.data() : null;
}


router.post('/gateway', async (req, res) => {
  try {
    const data = req.body;
     console.log('📥 Mame data ', data); 

    await db.collection('sensors').add(data);


    const thresholds = await getThresholds();
    if (!thresholds) {
      return res.status(500).json({ message: 'Threshold config not found' });
    }

    const shouldAlert =
      data.temperature > thresholds.tempMax ||
      data.co2Level > thresholds.co2Max ||
      data.humidity < thresholds.humidityMin;

    if (shouldAlert) {
      const alertData = {
        ...data,
        status: 'Active',
        confirmed: false
      };
      await db.collection('alerts').add(alertData);
      console.log('⚠️ Alert triggered');
    }

    res.status(201).json({ message: 'Data received and processed' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to handle gateway data', error: err });
  }
});

module.exports = router;