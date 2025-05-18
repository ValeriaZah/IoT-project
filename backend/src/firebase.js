const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Читаем секрет из переменной окружения
const serviceAccount = JSON.parse(
  Buffer.from(process.env.FIREBASE_CONFIG_BASE64, 'base64').toString('utf-8')
);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
module.exports = db;