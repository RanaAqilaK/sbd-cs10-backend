const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Import routes
const authRoutes = require('./routes/authRoutes'); 
const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Handle CORS for both local and production environments
const allowedOrigins = new Set([
  process.env.CORS_ORIGIN,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  'http://localhost:3000',
  'http://localhost:3001',
].filter(Boolean));

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (
      allowedOrigins.has(origin) ||
      origin.endsWith('.vercel.app') ||
      origin === 'https://vercel.app'
    ) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5,
  message: {
    success: false,
    message: 'Too many requests, please try again after 15 minutes',
    payload: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/items', itemRoutes);
app.use('/transaction', transactionRoutes);
app.use('/reports', reportRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    payload: null,
  });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    payload: null,
  });
});

module.exports = app;