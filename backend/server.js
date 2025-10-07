const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const Admin = require('./models/Admin');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5002;

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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', auth, require('./routes/clients'));
app.use('/api/vehicleTypes', auth, require('./routes/vehicleTypes'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
