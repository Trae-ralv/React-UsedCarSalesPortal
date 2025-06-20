const express = require('express');
const cors = require('cors');
const path = require('path');

const carRoutes = require('./server/routes/carRoutes');
const userRoutes = require('./server/routes/userRoutes');

const app = express();

// Request from React
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/cars', carRoutes);
app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('═══════════════════════════════════════');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log('═══════════════════════════════════════');
});