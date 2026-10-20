import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, initDatabase } from './db.js';
import { authRouter } from './routes/authRoutes.js';
import { addressRouter } from './routes/addressRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { menuRouter } from './routes/menuRoutes.js';
import { adminRouter } from './routes/adminRoutes.js';
import { settingsRouter } from './routes/settingsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Database & Seeds
initDatabase();

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// CORS Configuration — Strictly allow Vercel production frontend and local dev environments
const allowedOriginEnv = process.env.CORS_ORIGIN || process.env.CLIENT_URL || process.env.FRONTEND_URL;
const defaultAllowedOrigins = [
  'https://fine-dine-knl-restaurant.vercel.app',
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5000',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:3000',
];

const corsOrigins = [...defaultAllowedOrigins];
if (allowedOriginEnv) {
  const custom = allowedOriginEnv.split(',').map(s => s.trim().replace(/\/+$/, ''));
  corsOrigins.push(...custom);
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow server-to-server or requests with no origin (mobile native apps, curl, or same-origin)
    if (!origin) {
      return callback(null, true);
    }
    // Match exact allowed origins
    if (corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    // Allow any vercel.app or onrender.com preview deployment
    if (origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS error: Origin ${origin} not permitted`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Health Check (with active SQLite probe)
app.get('/api/health', (req, res) => {
  try {
    const probe = db.prepare('SELECT 1 as alive').get();
    const isDbConnected = probe && probe.alive === 1;

    res.json({
      status: isDbConnected ? 'healthy' : 'degraded',
      database: isDbConnected ? 'connected' : 'unreachable',
      name: 'FINE DINE KNL RESTAURANT Backend API',
      location: 'Kurnool, Andhra Pradesh',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: 'Database connection failed',
      timestamp: new Date().toISOString()
    });
  }
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/addresses', addressRouter);
app.use('/api/orders', orderRouter);
app.use('/api/menu', menuRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/admin', adminRouter);

// Serve built frontend assets in production (Unified Architecture)
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback for all non-API GET routes to support direct page refreshes
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile('index.html', { root: distPath });
    }
    next();
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start Server
app.listen(PORT, HOST, () => {
  console.log(`🚀 FINE DINE KNL RESTAURANT running on http://${HOST}:${PORT}`);
  console.log(`📍 Health check: http://${HOST}:${PORT}/api/health`);
});
