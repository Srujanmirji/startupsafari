require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const ideaRoutes = require('./routes/ideaRoutes');
const analysisRoutes = require('./routes/analysisRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const chatRoutes = require('./routes/chatRoutes');
const cofounderRoutes = require('./routes/cofounderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StartupSafari API is Live. Please use http://localhost:3000 for the app.' });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'StartupSafari Backend is running' });
});

// API Routes
app.use('/api/ideas', ideaRoutes);
app.use('/api', analysisRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/co-founder', cofounderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
