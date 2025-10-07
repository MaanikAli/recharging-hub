import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Admin from './backend/models/Admin.js';
import auth from './backend/middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect('mongodb+srv://sowad:sowad@cluster0.m7vh241.mongodb.net/rechargeHub?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('MongoDB connected');
    // Initialize preset admin
    const existingAdmin = await Admin.findOne({ username: 'tarek' });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('tarek123', 10);
      const admin = new Admin({ username: 'tarek', password: hashedPassword });
      await admin.save();
      console.log('Preset admin created');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
import authRoutes from './backend/routes/auth.js';
import clientRoutes from './backend/routes/clients.js';
import vehicleTypeRoutes from './backend/routes/vehicleTypes.js';

app.use('/api/auth', authRoutes);
app.use('/api/clients', auth, clientRoutes);
app.use('/api/vehicleTypes', auth, vehicleTypeRoutes);

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Serve index.html for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// For Vercel deployment
if (process.env.VERCEL) {
  export default app;
} else {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
