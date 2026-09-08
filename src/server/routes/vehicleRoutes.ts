import { Router } from 'express';
import {
  getVehicleData,
  getLatestVehicleData,
  updateVehicleData,
  updateVehiclePower,
  updateHeadlight,
  updateTelemetry,
  resetVehicleData
} from '../controllers/vehicleController';

const router = Router();

/**
 * -------------------------------------------------------------
 * Electric Vehicle / Scooty Controller REST API Routes
 * Base: /api/vehicle
 * -------------------------------------------------------------
 */

// 1. GET Latest Telemetry
router.get('/latest', getLatestVehicleData);

// 2. GET Vehicle Data by ID or Default
router.get('/', getVehicleData);
router.get('/:id', getVehicleData);

// 3. POST / PUT Update Vehicle Data (Full / Partial)
router.post('/', updateVehicleData);
router.put('/', updateVehicleData);
router.put('/:id', updateVehicleData);

// 4. Vehicle Power ON/OFF
router.patch('/power', updateVehiclePower);
router.post('/power', updateVehiclePower);

// 5. Headlight ON/OFF
router.patch('/headlight', updateHeadlight);
router.post('/headlight', updateHeadlight);

// 6. Update Battery %, Speed and Temperature
router.patch('/telemetry', updateTelemetry);
router.post('/telemetry', updateTelemetry);

// 7. Reset to Default
router.post('/reset', resetVehicleData);

export default router;
