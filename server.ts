import express from 'express';
import cors from 'cors';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import vehicleRoutes from './src/server/routes/vehicleRoutes';
import { isFirebaseActive } from './src/server/config/firebase';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api')) {
      const time = new Date().toISOString().split('T')[1].slice(0, 8);
      console.log(`[API ${time}] ${req.method} ${req.originalUrl}`);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.status(200).json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'EV / Scooty Controller API',
      database: isFirebaseActive() ? 'Firebase Firestore (Connected)' : 'In-Memory Store (Active)',
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

  // Mount Vehicle REST API Routes FIRST
  app.use('/api/vehicle', vehicleRoutes);

  // Vite middleware setup (SPA fallback)
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`====================================================`);
    console.log(`⚡ EV Scooty Server running on http://localhost:${PORT}`);
    console.log(`📡 Vehicle API: http://localhost:${PORT}/api/vehicle`);
    console.log(`🩺 Health API: http://localhost:${PORT}/api/health`);
    console.log(`====================================================`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
