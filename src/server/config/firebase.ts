import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';

let db: Firestore | null = null;
let isFirebaseConnected = false;
let appInstance: App | null = null;

export interface VehicleRecord {
  id: string;
  vehicleName: string;
  batteryPercentage: number;
  speed: number;
  temperature: number;
  isVehicleOn: boolean;
  vehicleStatus: 'ON' | 'OFF';
  isHeadlightOn: boolean;
  headlightStatus: 'ON' | 'OFF';
  packVoltage: number;
  packCurrent: number;
  estimatedRangeKm: number;
  odometerKm: number;
  updatedAt: string;
  createdAt: string;
}

export const inMemoryStore = {
  vehicles: new Map<string, VehicleRecord>([
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

export function initFirebase(): Firestore | null {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    appInstance = existingApps[0];
    return getFirestore(appInstance);
  }

  try {
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH 
      ? path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
      : path.resolve(process.cwd(), 'serviceAccountKey.json');

    if (fs.existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
      appInstance = initializeApp({
        credential: cert(serviceAccount)
      });
      isFirebaseConnected = true;
      console.log('✅ [Firebase] Connected with serviceAccountKey.json');
      return getFirestore(appInstance);
    }

    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
      appInstance = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: privateKey
        })
      });
      isFirebaseConnected = true;
      console.log('✅ [Firebase] Connected with environment variables');
      return getFirestore(appInstance);
    }

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      appInstance = initializeApp();
      isFirebaseConnected = true;
      console.log('✅ [Firebase] Connected with Application Default Credentials');
      return getFirestore(appInstance);
    }

    // Graceful fallback for local development / testing without credentials
    isFirebaseConnected = false;
    return null;
  } catch (error: any) {
    console.warn('⚠️ [Firebase] Initialization notice:', error?.message || error);
    isFirebaseConnected = false;
    return null;
  }
}

export function getDb(): Firestore | null {
  if (!db) {
    db = initFirebase();
  }
  return db;
}

export function isFirebaseActive(): boolean {
  return isFirebaseConnected;
}
