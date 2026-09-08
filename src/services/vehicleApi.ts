/**
 * Vehicle REST API Service for Frontend
 * Connects frontend to the Express + Firebase Firestore backend
 */

export interface VehicleApiData {
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
  createdAt?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  storage?: string;
  data: T;
  error?: string;
}

// In local dev and full-stack mode, /api is relative; if configured via env, use custom base URL
const BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || '';

export const vehicleApi = {
  /**
   * GET /api/vehicle
   * Fetch current vehicle record
   */
  async getVehicleData(id: string = 'default-scooty'): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/${id}`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * GET /api/vehicle/latest
   * Fetch the latest real-time vehicle telemetry
   */
  async getLatest(): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/latest`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * POST /api/vehicle
   * Full or partial update of vehicle attributes
   */
  async updateVehicle(data: Partial<VehicleApiData>): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * PATCH /api/vehicle/power
   * Turn vehicle power ON/OFF
   */
  async setVehiclePower(isVehicleOn: boolean): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/power`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isVehicleOn })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * PATCH /api/vehicle/headlight
   * Turn headlight ON/OFF
   */
  async setHeadlight(isHeadlightOn: boolean): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/headlight`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isHeadlightOn })
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * PATCH /api/vehicle/telemetry
   * Update battery %, speed, and temperature
   */
  async updateTelemetry(metrics: {
    batteryPercentage?: number;
    speed?: number;
    temperature?: number;
  }): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/telemetry`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(metrics)
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  },

  /**
   * POST /api/vehicle/reset
   * Reset vehicle to baseline parameters
   */
  async reset(): Promise<ApiResponse<VehicleApiData>> {
    const res = await fetch(`${BASE_URL}/api/vehicle/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return res.json();
  }
};
