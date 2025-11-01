const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json());

// Import routes
const petsRoutes = require('./routes/pets');

// Use routes
app.use('/api/pets', petsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running!' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Pet Your Pet Backend API' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`=� Server running on http://localhost:${PORT}`);
  console.log(`=� API endpoints available at http://localhost:${PORT}/api`);
});
