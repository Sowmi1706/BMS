import { initializeApp, getApps, getApp } from '@firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  getDocFromServer,
  Firestore
} from '@firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific databaseId if provided
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface FirebaseVehicleData {
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

export const DEFAULT_VEHICLE_RECORD: FirebaseVehicleData = {
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
};

/**
 * Validates connection to Firestore server on boot
 */
export async function validateFirestoreConnection(): Promise<boolean> {
  try {
    const testRef = doc(db, 'vehicles', 'default-scooty');
    const snap = await getDocFromServer(testRef);
    if (!snap.exists()) {
      await setDoc(testRef, DEFAULT_VEHICLE_RECORD);
    }
    console.log('✅ [Firebase Firestore] Connection verified online');
    return true;
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('⚠️ [Firebase] Client is offline. Please check your Firebase configuration.');
    } else {
      console.warn('⚠️ [Firebase] Firestore notice:', error?.message || error);
    }
    return false;
  }
}

/**
 * Listen to real-time vehicle updates from Firestore
 */
export function subscribeToVehicle(
  vehicleId: string = 'default-scooty',
  callback: (data: FirebaseVehicleData) => void,
  onError?: (err: Error) => void
) {
  const vehicleRef = doc(db, 'vehicles', vehicleId);
  return onSnapshot(
    vehicleRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const raw = snapshot.data();
        callback({
          id: raw.id || vehicleId,
          vehicleName: raw.vehicleName || 'EV Scooty Urban GT',
          batteryPercentage: Number(raw.batteryPercentage ?? 92.8),
          speed: Number(raw.speed ?? 0),
          temperature: Number(raw.temperature ?? 29.0),
          isVehicleOn: Boolean(raw.isVehicleOn),
          vehicleStatus: raw.isVehicleOn ? 'ON' : 'OFF',
          isHeadlightOn: Boolean(raw.isHeadlightOn),
          headlightStatus: raw.isHeadlightOn ? 'ON' : 'OFF',
          packVoltage: Number(raw.packVoltage ?? 81.4),
          packCurrent: Number(raw.packCurrent ?? 0.0),
          estimatedRangeKm: Number(raw.estimatedRangeKm ?? 185),
          odometerKm: Number(raw.odometerKm ?? 1240.5),
          updatedAt: raw.updatedAt || new Date().toISOString(),
          createdAt: raw.createdAt || new Date().toISOString(),
        });
      } else {
        // Initialize doc in Firestore
        setDoc(vehicleRef, { ...DEFAULT_VEHICLE_RECORD, id: vehicleId }).catch(() => {});
        callback(DEFAULT_VEHICLE_RECORD);
      }
    },
    (error) => {
      if (onError) onError(error);
    }
  );
}

/**
 * Save vehicle telemetry directly to Firestore
 */
export async function saveVehicleToFirestore(
  vehicleId: string = 'default-scooty',
  updates: Partial<FirebaseVehicleData>
): Promise<void> {
  const vehicleRef = doc(db, 'vehicles', vehicleId);
  await setDoc(
    vehicleRef,
    {
      ...updates,
      updatedAt: new Date().toISOString()
    },
    { merge: true }
  );
}
