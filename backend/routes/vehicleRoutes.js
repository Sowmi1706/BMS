const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');

/**
 * -------------------------------------------------------------
 * Electric Vehicle / Scooty Controller API Routes
 * Base Path: /api/vehicle
 * -------------------------------------------------------------
 */

// 1. GET Latest Vehicle Telemetry
router.get('/latest', vehicleController.getLatestVehicleData);

// 2. GET Vehicle Data by ID or Default ('default-scooty')
router.get('/', vehicleController.getVehicleData);
router.get('/:id', vehicleController.getVehicleData);

// 3. POST / PUT Update Vehicle Data (Full or Partial)
router.post('/', vehicleController.updateVehicleData);
router.put('/', vehicleController.updateVehicleData);
router.put('/:id', vehicleController.updateVehicleData);

// 4. Vehicle Power ON/OFF status
// Accepts: { isVehicleOn: true/false } or { vehicleStatus: "ON"/"OFF" } or { toggle: true }
router.patch('/power', vehicleController.updateVehiclePower);
router.post('/power', vehicleController.updateVehiclePower);

// 5. Headlight ON/OFF status
// Accepts: { isHeadlightOn: true/false } or { headlightStatus: "ON"/"OFF" } or { toggle: true }
router.patch('/headlight', vehicleController.updateHeadlight);
router.post('/headlight', vehicleController.updateHeadlight);

// 6. Update Battery %, Speed and Temperature
// Accepts: { batteryPercentage?: number, speed?: number, temperature?: number }
router.patch('/telemetry', vehicleController.updateTelemetry);
router.post('/telemetry', vehicleController.updateTelemetry);

// 7. Reset Vehicle to Baseline Defaults
router.post('/reset', vehicleController.resetVehicleData);

module.exports = router;
