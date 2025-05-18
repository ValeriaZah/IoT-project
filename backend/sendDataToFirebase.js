const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const serviceAccount = require("./iot-firebase-key.json");
const snap = await db.collection('config').doc('thresholds').get();
const THRESHOLDS = snap.data();

// Initialize Firebase
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

// Simulated sensor data
const data = {
  sensorId: "A23",
  temperature: 55,
  co2Level: 120,
  humidity: 15,
  gps: [50.880078, 14.249905],
  dateTime: new Date().toISOString(),
  confirmed: false,
  status: "Active"
};

// Load thresholds from Firestore
async function getThresholds() {
  try {
    const snap = await db.collection("config").doc("thresholds").get();
    return snap.exists ? snap.data() : null;
  } catch (err) {
    console.error("❌ Error fetching thresholds:", err);
    return null;
  }
}

// Main logic to send data
async function sendData() {
  try {
    const THRESHOLDS = await getThresholds();

    if (!THRESHOLDS) {
      console.log("⚠️ No thresholds found. Check Firestore → config/thresholds");
      return;
    }

    const shouldCreateAlert =
      data.temperature > THRESHOLDS.tempMax ||
      data.co2Level > THRESHOLDS.co2Max ||
      data.humidity < THRESHOLDS.humidityMin;

    // Save to sensors collection regardless of threshold
    await db.collection("sensors").add(data);
    console.log("📥 Sensor data saved");

    if (shouldCreateAlert) {
      const docRef = await db.collection("alerts").add(data);
      console.log("🚨 Alert sent with ID:", docRef.id);
    } else {
      console.log("✅ All values within threshold");
    }
  } catch (err) {
    console.error("❌ Failed to process data:", err);
  }
}

// Schedule every 5 minutes
setInterval(sendData, 5 * 60 * 1000);
sendData(); // Initial run