const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const vehicleRoutes = require('./routes/vehicleRoutes');
const { isFirebaseActive } = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend applications
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const now = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${now}] ${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'EV / Scooty Controller Backend',
    database: isFirebaseActive() ? 'Firebase Firestore (Connected)' : 'In-Memory Fallback (Active)',
    endpoints: {
      getVehicleData: 'GET /api/vehicle',
      getLatestVehicleData: 'GET /api/vehicle/latest',
      updateVehicleData: 'POST /api/vehicle',
      updatePower: 'PATCH /api/vehicle/power',
      updateHeadlight: 'PATCH /api/vehicle/headlight',
      updateTelemetry: 'PATCH /api/vehicle/telemetry',
      resetVehicleData: 'POST /api/vehicle/reset'
    }
  });
});

// Mount Vehicle API Routes
app.use('/api/vehicle', vehicleRoutes);

// Welcome / API Documentation root
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Electric Vehicle / Scooty Controller REST API Backend',
    version: '1.0.0',
    documentation: '/api/health',
    vehicleApi: '/api/vehicle',
    firebaseStatus: isFirebaseActive() ? 'Connected' : 'Offline (Using memory fallback)'
  });
});

// 404 Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`⚡ EV Scooty Backend Server running on port ${PORT}`);
    console.log(`📡 Vehicle API Endpoint: http://localhost:${PORT}/api/vehicle`);
    console.log(`🩺 Health & Diagnostic: http://localhost:${PORT}/api/health`);
    console.log(`🔥 Database Mode: ${isFirebaseActive() ? 'Firebase Firestore' : 'Memory Store'}`);
    console.log(`====================================================`);
  });
}

module.exports = app;
