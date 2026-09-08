const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let db = null;
let isFirebaseConnected = false;

/**
 * In-memory vehicle storage fallback when Firebase credentials are not yet configured.
 * Guarantees zero runtime crash during initial setup and testing.
 */
const inMemoryStore = {
  vehicles: new Map([
    [
      'default-scooty',
      {
        id: 'default-scooty',
        vehicleName: 'EV Scooty Urban GT',
        batteryPercentage: 92.8,
        speed: 0,
        temperature: 29.0,
        isVehicleOn: false,
        vehicleStatus: 'OFF',
        isHeadlightOn: false,
        headlightStatus: 'OFF',
        packVoltage: 81.4,
        packCurrent: 0.0,
        estimatedRangeKm: 185,
        odometerKm: 1240.5,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString()
      }
    ]
  ])
};

/**
 * Initializes Firebase Admin SDK and exports Firestore db instance
 */
function initFirebase() {
  if (admin.apps.length > 0) {
    return admin.firestore();
  }

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
      ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(__dirname, '../serviceAccountKey.json');

    // 1. Check if serviceAccountKey.json exists
    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      isFirebaseConnected = true;
      console.log('✅ Firebase Admin initialized with service account key file.');
      return admin.firestore();
    }

    // 2. Check if credentials are provided via individual environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      isFirebaseConnected = true;
      console.log('✅ Firebase Admin initialized with environment variables.');
      return admin.firestore();
    }

    // 3. Check for Google Application Default Credentials
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      admin.initializeApp();
      isFirebaseConnected = true;
      console.log('✅ Firebase Admin initialized with GOOGLE_APPLICATION_CREDENTIALS.');
      return admin.firestore();
    }

    console.warn('⚠️ [Firebase] No serviceAccountKey.json or credentials found in environment.');
    console.warn('ℹ️ [Firebase] Operating in in-memory fallback store mode. Follow README.md to configure Firebase Firestore.');
    isFirebaseConnected = false;
    return null;
  } catch (error) {
    console.error('❌ [Firebase] Failed to initialize Firebase Admin SDK:', error.message);
    isFirebaseConnected = false;
    return null;
  }
}

// Lazy getter for Firestore database
function getDb() {
  if (!db) {
    db = initFirebase();
  }
  return db;
}

module.exports = {
  admin,
  getDb,
  inMemoryStore,
  isFirebaseActive: () => isFirebaseConnected
};
