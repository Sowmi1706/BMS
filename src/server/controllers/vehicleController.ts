import { Request, Response } from 'express';
import { getDb, inMemoryStore, isFirebaseActive, VehicleRecord } from '../config/firebase';

const COLLECTION_NAME = process.env.FIRESTORE_COLLECTION || 'vehicles';
const DEFAULT_VEHICLE_ID = 'default-scooty';

const DEFAULT_VEHICLE_STATE: VehicleRecord = {
  id: DEFAULT_VEHICLE_ID,
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

function normalizeVehicleData(data: any, docId?: string): VehicleRecord {
  const isVehicleOn = typeof data.isVehicleOn === 'boolean'
    ? data.isVehicleOn
    : data.vehicleStatus === 'ON';

  const isHeadlightOn = typeof data.isHeadlightOn === 'boolean'
    ? data.isHeadlightOn
    : data.headlightStatus === 'ON';

  return {
    id: docId || data.id || DEFAULT_VEHICLE_ID,
    vehicleName: data.vehicleName || 'EV Scooty Urban GT',
    batteryPercentage: Number(data.batteryPercentage ?? 92.8),
    speed: Number(data.speed ?? 0),
    temperature: Number(data.temperature ?? 29.0),
    isVehicleOn,
    vehicleStatus: isVehicleOn ? 'ON' : 'OFF',
    isHeadlightOn,
    headlightStatus: isHeadlightOn ? 'ON' : 'OFF',
    packVoltage: Number(data.packVoltage ?? 81.4),
    packCurrent: Number(data.packCurrent ?? 0.0),
    estimatedRangeKm: Number(data.estimatedRangeKm ?? 185),
    odometerKm: Number(data.odometerKm ?? 1240.5),
    updatedAt: data.updatedAt || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString()
  };
}

export const getVehicleData = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.params.id || DEFAULT_VEHICLE_ID;
  const db = getDb();

  try {
    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      const docSnap = await docRef.get();

      if (!docSnap.exists) {
        const initial = { ...DEFAULT_VEHICLE_STATE, id: vehicleId, createdAt: new Date().toISOString() };
        await docRef.set(initial);
        res.status(200).json({
          success: true,
          message: 'Vehicle data retrieved (initialized default)',
          storage: 'firestore',
          data: normalizeVehicleData(initial, vehicleId)
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Vehicle data retrieved successfully',
        storage: 'firestore',
        data: normalizeVehicleData(docSnap.data(), vehicleId)
      });
      return;
    }

    let vehicle = inMemoryStore.vehicles.get(vehicleId);
    if (!vehicle) {
      vehicle = { ...DEFAULT_VEHICLE_STATE, id: vehicleId };
      inMemoryStore.vehicles.set(vehicleId, vehicle);
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle data retrieved successfully',
      storage: 'in-memory',
      data: normalizeVehicleData(vehicle, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in getVehicleData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve vehicle data',
      error: error?.message
    });
  }
};

export const getLatestVehicleData = async (req: Request, res: Response): Promise<void> => {
  const db = getDb();
  const vehicleId = (req.query.id as string) || DEFAULT_VEHICLE_ID;

  try {
    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        res.status(200).json({
          success: true,
          message: 'Latest vehicle data retrieved',
          storage: 'firestore',
          timestamp: new Date().toISOString(),
          data: normalizeVehicleData(docSnap.data(), vehicleId)
        });
        return;
      }
    }

    const vehicle = inMemoryStore.vehicles.get(vehicleId) || DEFAULT_VEHICLE_STATE;
    res.status(200).json({
      success: true,
      message: 'Latest vehicle data retrieved',
      storage: isFirebaseActive() ? 'firestore' : 'in-memory',
      timestamp: new Date().toISOString(),
      data: normalizeVehicleData(vehicle, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in getLatestVehicleData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest vehicle data',
      error: error?.message
    });
  }
};

export const updateVehicleData = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.body.id || req.params.id || DEFAULT_VEHICLE_ID;
  const updates = req.body;
  const db = getDb();

  try {
    const payload: Partial<VehicleRecord> = {
      updatedAt: new Date().toISOString()
    };

    if (updates.vehicleName !== undefined) payload.vehicleName = String(updates.vehicleName);
    if (updates.batteryPercentage !== undefined) {
      payload.batteryPercentage = Math.min(100, Math.max(0, Number(updates.batteryPercentage)));
    }
    if (updates.speed !== undefined) {
      payload.speed = Math.max(0, Number(updates.speed));
    }
    if (updates.temperature !== undefined) {
      payload.temperature = Number(updates.temperature);
    }
    if (updates.isVehicleOn !== undefined) {
      payload.isVehicleOn = Boolean(updates.isVehicleOn);
      payload.vehicleStatus = payload.isVehicleOn ? 'ON' : 'OFF';
    } else if (updates.vehicleStatus !== undefined) {
      payload.isVehicleOn = updates.vehicleStatus === 'ON';
      payload.vehicleStatus = payload.isVehicleOn ? 'ON' : 'OFF';
    }
    if (updates.isHeadlightOn !== undefined) {
      payload.isHeadlightOn = Boolean(updates.isHeadlightOn);
      payload.headlightStatus = payload.isHeadlightOn ? 'ON' : 'OFF';
    } else if (updates.headlightStatus !== undefined) {
      payload.isHeadlightOn = updates.headlightStatus === 'ON';
      payload.headlightStatus = payload.isHeadlightOn ? 'ON' : 'OFF';
    }
    if (updates.packVoltage !== undefined) payload.packVoltage = Number(updates.packVoltage);
    if (updates.packCurrent !== undefined) payload.packCurrent = Number(updates.packCurrent);
    if (updates.estimatedRangeKm !== undefined) payload.estimatedRangeKm = Number(updates.estimatedRangeKm);
    if (updates.odometerKm !== undefined) payload.odometerKm = Number(updates.odometerKm);

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      await docRef.set(payload, { merge: true });
      const snap = await docRef.get();
      res.status(200).json({
        success: true,
        message: 'Vehicle data updated successfully in Firestore',
        storage: 'firestore',
        data: normalizeVehicleData(snap.data(), vehicleId)
      });
      return;
    }

    const current = inMemoryStore.vehicles.get(vehicleId) || { ...DEFAULT_VEHICLE_STATE, id: vehicleId };
    const merged = { ...current, ...payload };
    inMemoryStore.vehicles.set(vehicleId, merged);

    res.status(200).json({
      success: true,
      message: 'Vehicle data updated successfully',
      storage: 'in-memory',
      data: normalizeVehicleData(merged, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in updateVehicleData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle data',
      error: error?.message
    });
  }
};

export const updateVehiclePower = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.body.id || DEFAULT_VEHICLE_ID;
  const db = getDb();

  try {
    let currentIsOn = false;

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      const snap = await docRef.get();
      if (snap.exists) {
        currentIsOn = Boolean(snap.data()?.isVehicleOn);
      }
    } else {
      const current = inMemoryStore.vehicles.get(vehicleId) || DEFAULT_VEHICLE_STATE;
      currentIsOn = Boolean(current.isVehicleOn);
    }

    let newIsOn: boolean;
    if (req.body.toggle === true) {
      newIsOn = !currentIsOn;
    } else if (typeof req.body.isVehicleOn === 'boolean') {
      newIsOn = req.body.isVehicleOn;
    } else if (req.body.vehicleStatus) {
      newIsOn = String(req.body.vehicleStatus).toUpperCase() === 'ON';
    } else if (req.body.status) {
      newIsOn = String(req.body.status).toUpperCase() === 'ON';
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payload. Provide { isVehicleOn: boolean } or { vehicleStatus: "ON"|"OFF" } or { toggle: true }'
      });
      return;
    }

    const payload: Partial<VehicleRecord> = {
      isVehicleOn: newIsOn,
      vehicleStatus: newIsOn ? 'ON' : 'OFF',
      ...(newIsOn === false ? { speed: 0 } : {}),
      updatedAt: new Date().toISOString()
    };

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      await docRef.set(payload, { merge: true });
      const snap = await docRef.get();
      res.status(200).json({
        success: true,
        message: `Vehicle power turned ${newIsOn ? 'ON' : 'OFF'}`,
        data: normalizeVehicleData(snap.data(), vehicleId)
      });
      return;
    }

    const current = inMemoryStore.vehicles.get(vehicleId) || { ...DEFAULT_VEHICLE_STATE, id: vehicleId };
    const merged = { ...current, ...payload };
    inMemoryStore.vehicles.set(vehicleId, merged);

    res.status(200).json({
      success: true,
      message: `Vehicle power turned ${newIsOn ? 'ON' : 'OFF'}`,
      data: normalizeVehicleData(merged, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in updateVehiclePower:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update vehicle power state',
      error: error?.message
    });
  }
};

export const updateHeadlight = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.body.id || DEFAULT_VEHICLE_ID;
  const db = getDb();

  try {
    let currentIsOn = false;

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      const snap = await docRef.get();
      if (snap.exists) {
        currentIsOn = Boolean(snap.data()?.isHeadlightOn);
      }
    } else {
      const current = inMemoryStore.vehicles.get(vehicleId) || DEFAULT_VEHICLE_STATE;
      currentIsOn = Boolean(current.isHeadlightOn);
    }

    let newIsOn: boolean;
    if (req.body.toggle === true) {
      newIsOn = !currentIsOn;
    } else if (typeof req.body.isHeadlightOn === 'boolean') {
      newIsOn = req.body.isHeadlightOn;
    } else if (req.body.headlightStatus) {
      newIsOn = String(req.body.headlightStatus).toUpperCase() === 'ON';
    } else if (req.body.status) {
      newIsOn = String(req.body.status).toUpperCase() === 'ON';
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payload. Provide { isHeadlightOn: boolean } or { headlightStatus: "ON"|"OFF" } or { toggle: true }'
      });
      return;
    }

    const payload: Partial<VehicleRecord> = {
      isHeadlightOn: newIsOn,
      headlightStatus: newIsOn ? 'ON' : 'OFF',
      updatedAt: new Date().toISOString()
    };

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      await docRef.set(payload, { merge: true });
      const snap = await docRef.get();
      res.status(200).json({
        success: true,
        message: `Headlight turned ${newIsOn ? 'ON' : 'OFF'}`,
        data: normalizeVehicleData(snap.data(), vehicleId)
      });
      return;
    }

    const current = inMemoryStore.vehicles.get(vehicleId) || { ...DEFAULT_VEHICLE_STATE, id: vehicleId };
    const merged = { ...current, ...payload };
    inMemoryStore.vehicles.set(vehicleId, merged);

    res.status(200).json({
      success: true,
      message: `Headlight turned ${newIsOn ? 'ON' : 'OFF'}`,
      data: normalizeVehicleData(merged, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in updateHeadlight:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update headlight state',
      error: error?.message
    });
  }
};

export const updateTelemetry = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.body.id || DEFAULT_VEHICLE_ID;
  const { batteryPercentage, speed, temperature } = req.body;
  const db = getDb();

  if (batteryPercentage === undefined && speed === undefined && temperature === undefined) {
    res.status(400).json({
      success: false,
      message: 'Provide at least one metric: batteryPercentage, speed, or temperature'
    });
    return;
  }

  try {
    const payload: Partial<VehicleRecord> = {
      updatedAt: new Date().toISOString()
    };

    if (batteryPercentage !== undefined) {
      payload.batteryPercentage = Math.min(100, Math.max(0, Number(batteryPercentage)));
    }
    if (speed !== undefined) {
      payload.speed = Math.max(0, Number(speed));
    }
    if (temperature !== undefined) {
      payload.temperature = Number(temperature);
    }

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      await docRef.set(payload, { merge: true });
      const snap = await docRef.get();
      res.status(200).json({
        success: true,
        message: 'Telemetry metrics updated successfully',
        data: normalizeVehicleData(snap.data(), vehicleId)
      });
      return;
    }

    const current = inMemoryStore.vehicles.get(vehicleId) || { ...DEFAULT_VEHICLE_STATE, id: vehicleId };
    const merged = { ...current, ...payload };
    inMemoryStore.vehicles.set(vehicleId, merged);

    res.status(200).json({
      success: true,
      message: 'Telemetry metrics updated successfully',
      data: normalizeVehicleData(merged, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in updateTelemetry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update telemetry',
      error: error?.message
    });
  }
};

export const resetVehicleData = async (req: Request, res: Response): Promise<void> => {
  const vehicleId = req.body.id || DEFAULT_VEHICLE_ID;
  const db = getDb();

  try {
    const resetData: VehicleRecord = {
      ...DEFAULT_VEHICLE_STATE,
      id: vehicleId,
      updatedAt: new Date().toISOString()
    };

    if (db && isFirebaseActive()) {
      const docRef = db.collection(COLLECTION_NAME).doc(vehicleId);
      await docRef.set(resetData);
      res.status(200).json({
        success: true,
        message: 'Vehicle state reset to default baseline',
        data: normalizeVehicleData(resetData, vehicleId)
      });
      return;
    }

    inMemoryStore.vehicles.set(vehicleId, resetData);
    res.status(200).json({
      success: true,
      message: 'Vehicle state reset to default baseline',
      data: normalizeVehicleData(resetData, vehicleId)
    });
  } catch (error: any) {
    console.error('Error in resetVehicleData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset vehicle data',
      error: error?.message
    });
  }
};
