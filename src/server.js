import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so Vite frontend (http://localhost:5173) can talk to Express API
app.use(cors());
app.use(express.json());

// In-memory fleet database
let fleet = [
  {
    id: 'v1',
    plateNumber: 'KEE 456Z',
    driverName: 'John Doe',
    driverPhone: '+254712345678',
    model: 'Toyota Hilux',
    odometer: 75000,
    status: 'Operational',
    lastService: '2026-08-15',
  },
  {
    id: 'v2',
    plateNumber: 'KDC 789X',
    driverName: 'Jane Smith',
    driverPhone: '+254722987654',
    model: 'Isuzu D-Max',
    odometer: 112000,
    status: 'In Maintenance',
    lastService: '2026-09-01',
  },
  {
    id: 'v3',
    plateNumber: 'KDB 123Y',
    driverName: 'Peter Kamau',
    driverPhone: '+254733112233',
    model: 'Nissan NP300',
    odometer: 43500,
    status: 'Operational',
    lastService: '2026-07-20',
  },
];

// 1. GET /api/v1/vehicles - Fetch all vehicles
app.get('/api/v1/vehicles', (req, res) => {
  res.status(200).json(fleet);
});

// 2. GET /api/v1/vehicles/:id - Fetch a single vehicle
app.get('/api/v1/vehicles/:id', (req, res) => {
  const vehicle = fleet.find((v) => v.id === req.params.id);
  if (!vehicle) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.status(200).json(vehicle);
});

// 3. POST /api/v1/vehicles - Register a new vehicle
app.post('/api/v1/vehicles', (req, res) => {
  const { plateNumber, driverName, driverPhone, model, odometer, status } = req.body;

  if (!plateNumber || !driverName) {
    return res.status(400).json({ error: 'Plate number and driver name are required.' });
  }

  const newVehicle = {
    id: `v_${Date.now()}`,
    plateNumber,
    driverName,
    driverPhone: driverPhone || 'N/A',
    model: model || 'Unknown Model',
    odometer: Number(odometer) || 0,
    status: status || 'Operational',
    lastService: new Date().toISOString().split('T')[0],
  };

  fleet.unshift(newVehicle);
  res.status(201).json(newVehicle);
});

// 4. DELETE /api/v1/vehicles/:id - Deregister a vehicle
app.delete('/api/v1/vehicles/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = fleet.length;
  fleet = fleet.filter((v) => v.id !== id);

  if (fleet.length === initialLength) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }

  res.status(200).json({ success: true, message: `Vehicle ${id} removed successfully.` });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Fleet Backend API running at http://localhost:${PORT}/api/v1/vehicles`);
});