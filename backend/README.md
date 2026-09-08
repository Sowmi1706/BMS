# ⚡ Electric Vehicle (EV) / Scooty Controller Backend

A high-performance Node.js & Express REST API with Firebase Firestore integration for managing electric vehicle and smart scooty telemetry.

---

## 📁 Clean Backend Folder Structure

```text
backend/
├── config/
│   └── firebase.js            # Firebase Admin SDK & Firestore database initialization
├── controllers/
│   └── vehicleController.js   # Business logic for all vehicle telemetry & control APIs
├── routes/
│   └── vehicleRoutes.js       # Express REST API endpoints & route mapping
├── .env.example               # Environment variables template
├── package.json               # Node.js dependencies & scripts
├── server.js                  # Main Express application entrypoint
└── serviceAccountKey.json     # (Your Firebase Admin Service Account Key)
```

---

## 🚀 Step 1: Install Dependencies

Navigate into the backend directory and install the required npm packages:

```bash
cd backend
npm install
```

Installed dependencies:
- **`express`**: Fast HTTP REST framework
- **`firebase-admin`**: Official Google Firebase Admin SDK to access Firestore securely
- **`cors`**: Enables Cross-Origin Resource Sharing for frontend access
- **`dotenv`**: Loads environment variables from `.env`
- **`nodemon`** (dev): Auto-reloads server upon code edits

---

## 🔥 Step 2: Configure Firebase Firestore

You have **two simple options** to connect Firebase Firestore:

### Option A: Using `serviceAccountKey.json` (Recommended)

1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Select your Firebase project (or create one).
3. Navigate to **Project Settings (Gear icon) > Service accounts**.
4. Click **Generate new private key** and download the `.json` file.
5. Rename the downloaded file to `serviceAccountKey.json` and place it inside the `backend/` directory:
   ```text
   backend/serviceAccountKey.json
   ```
6. In `backend/.env`, set:
   ```env
   PORT=5000
   FIREBASE_SERVICE_ACCOUNT_PATH=./serviceAccountKey.json
   ```

### Option B: Using Environment Variables

Alternatively, copy `.env.example` to `.env` and fill in the values directly:

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

> 💡 **Graceful Fallback Mode**: If Firebase credentials are not yet provided, the backend automatically operates with an in-memory store so the server boots smoothly, endpoints work instantly, and tests never crash. Once credentials are provided, it automatically syncs to Firebase Firestore!

---

## 💻 Step 3: Run the Backend Locally

### Development Mode (with hot reload):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The server will start on:
```text
http://localhost:5000
```

Verify it is running:
```bash
curl http://localhost:5000/api/health
```

---

## 📡 REST API Reference

All endpoints manage:
1. **`batteryPercentage`** (0 - 100%)
2. **`speed`** (km/h)
3. **`temperature`** (°C)
4. **`isVehicleOn` / `vehicleStatus`** (ON / OFF)
5. **`isHeadlightOn` / `headlightStatus`** (ON / OFF)

---

### 1. GET Vehicle Data
Retrieve vehicle data and telemetry.

- **URL**: `/api/vehicle` or `/api/vehicle/:id`
- **Method**: `GET`
- **Response `200 OK`**:
```json
{
  "success": true,
  "message": "Vehicle data retrieved successfully",
  "storage": "firestore",
  "data": {
    "id": "default-scooty",
    "vehicleName": "EV Scooty Urban GT",
    "batteryPercentage": 92.8,
    "speed": 0,
    "temperature": 29.0,
    "isVehicleOn": false,
    "vehicleStatus": "OFF",
    "isHeadlightOn": false,
    "headlightStatus": "OFF",
    "packVoltage": 81.4,
    "packCurrent": 0.0,
    "estimatedRangeKm": 185,
    "odometerKm": 1240.5,
    "updatedAt": "2026-09-07T10:30:00.000Z"
  }
}
```

---

### 2. GET Latest Vehicle Telemetry
Retrieve the latest live vehicle snapshot.

- **URL**: `/api/vehicle/latest`
- **Method**: `GET`
- **cURL**:
```bash
curl -X GET http://localhost:5000/api/vehicle/latest
```

---

### 3. POST / PUT Update Vehicle Data
Update one or more vehicle attributes.

- **URL**: `/api/vehicle`
- **Method**: `POST` or `PUT`
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "batteryPercentage": 88.5,
  "speed": 34.2,
  "temperature": 31.0,
  "isVehicleOn": true,
  "isHeadlightOn": true
}
```
- **cURL**:
```bash
curl -X POST http://localhost:5000/api/vehicle \
  -H "Content-Type: application/json" \
  -d '{"batteryPercentage": 88.5, "speed": 34.2, "temperature": 31.0, "isVehicleOn": true, "isHeadlightOn": true}'
```

---

### 4. PATCH Update Vehicle Power ON / OFF
Turn vehicle power ON or OFF, or toggle state.

- **URL**: `/api/vehicle/power`
- **Method**: `PATCH` (or `POST`)
- **Headers**: `Content-Type: application/json`
- **Body Option A (Explicit boolean)**:
```json
{ "isVehicleOn": true }
```
- **Body Option B (Status string)**:
```json
{ "vehicleStatus": "OFF" }
```
- **Body Option C (Toggle current state)**:
```json
{ "toggle": true }
```
- **cURL**:
```bash
curl -X PATCH http://localhost:5000/api/vehicle/power \
  -H "Content-Type: application/json" \
  -d '{"isVehicleOn": true}'
```

---

### 5. PATCH Update Headlight ON / OFF
Turn vehicle headlights ON or OFF, or toggle.

- **URL**: `/api/vehicle/headlight`
- **Method**: `PATCH` (or `POST`)
- **Headers**: `Content-Type: application/json`
- **Body Option A**:
```json
{ "isHeadlightOn": true }
```
- **Body Option B**:
```json
{ "headlightStatus": "OFF" }
```
- **Body Option C**:
```json
{ "toggle": true }
```
- **cURL**:
```bash
curl -X PATCH http://localhost:5000/api/vehicle/headlight \
  -H "Content-Type: application/json" \
  -d '{"isHeadlightOn": true}'
```

---

### 6. PATCH Update Battery %, Speed and Temperature
Update driving telemetry metrics simultaneously.

- **URL**: `/api/vehicle/telemetry`
- **Method**: `PATCH` (or `POST`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "batteryPercentage": 84.0,
  "speed": 45.5,
  "temperature": 30.2
}
```
- **cURL**:
```bash
curl -X PATCH http://localhost:5000/api/vehicle/telemetry \
  -H "Content-Type: application/json" \
  -d '{"batteryPercentage": 84.0, "speed": 45.5, "temperature": 30.2}'
```

---

### 7. POST Reset Vehicle Data
Resets vehicle to benchmark default telemetry.

- **URL**: `/api/vehicle/reset`
- **Method**: `POST`
- **cURL**:
```bash
curl -X POST http://localhost:5000/api/vehicle/reset
```

---

## 🔗 Step 4: Connecting Existing Frontend to Backend

In your frontend application:

1. **Set the Backend API Base URL** in your frontend `.env` or configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
2. **Fetch Vehicle Data in React**:
   ```javascript
   import { useEffect, useState } from 'react';

   export function useVehicleTelemetry() {
     const [vehicleData, setVehicleData] = useState(null);

     const fetchLatest = async () => {
       try {
         const res = await fetch('http://localhost:5000/api/vehicle/latest');
         const json = await res.json();
         if (json.success) setVehicleData(json.data);
       } catch (err) {
         console.error('Failed to load vehicle telemetry:', err);
       }
     };

     useEffect(() => {
       fetchLatest();
       const interval = setInterval(fetchLatest, 2000); // 2s live polling
       return () => clearInterval(interval);
     }, []);

     return { vehicleData, refresh: fetchLatest };
   }
   ```
3. **Send Commands from Frontend**:
   ```javascript
   // Toggle Vehicle Power
   await fetch('http://localhost:5000/api/vehicle/power', {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ isVehicleOn: true })
   });

   // Toggle Headlight
   await fetch('http://localhost:5000/api/vehicle/headlight', {
     method: 'PATCH',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ isHeadlightOn: true })
   });
   ```
