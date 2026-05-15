const path = require('path');
const fs = require('fs');

// Always load .env from this file's directory (works even if cwd is wrong, e.g. PowerShell Start-Job).
const envPath = path.join(__dirname, '.env');
require('dotenv').config({ path: envPath });

try {
  if (!fs.existsSync(envPath) || fs.statSync(envPath).size === 0) {
    console.error(
      '[BOOT] backend/.env is missing or empty on disk. Variables will not load — save the file in your editor (Ctrl+S), then restart.'
    );
  }
} catch (_) {
  /* ignore stat errors */
}

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
// const mongoose = require('mongoose'); // Removed MongoDB


// 0. GLOBAL ERROR HANDLERS (To prevent silent crash loops)
process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err.message);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

const app = express();

/** Local dev + optional production frontends (Vercel, etc.). Set FRONTEND_URL and/or CORS_ORIGINS on the host. */
function buildCorsOriginList() {
  const defaults = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
  ];
  const extra = [];
  if (process.env.FRONTEND_URL) {
    extra.push(String(process.env.FRONTEND_URL).trim().replace(/\/$/, ''));
  }
  if (process.env.CORS_ORIGINS) {
    String(process.env.CORS_ORIGINS)
      .split(',')
      .map((s) => s.trim().replace(/\/$/, ''))
      .filter(Boolean)
      .forEach((o) => extra.push(o));
  }
  return [...new Set([...defaults, ...extra])];
}

// 1. GLOBAL MIDDLEWARE (ORDER IS CRITICAL)
app.use(express.json());
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(
  cors({
    origin(origin, callback) {
      const allowed = buildCorsOriginList();
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      console.warn('[CORS] Blocked origin:', origin);
      return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
  })
);

// Request Logger
app.use((req, res, next) => {
  console.log(`[STRICT LOG] ${req.method} ${req.url}`);
  next();
});

// Lightweight health check (No DB query)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    ok: true,
    mode: 'Local/Mock Mode'
  });
});

// 3. ROUTES
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/news');
const scriptRoutes = require('./routes/script');
const financeRoutes = require('./routes/finance');
const creationsRoutes = require('./routes/creations');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/payment');

// Mount routes strictly under /api
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/script', scriptRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/creations', creationsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Fallback for 404
app.use((req, res) => {
  console.warn(`[404 WARNING] No route matched for ${req.method} ${req.url}`);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.url} not found on this server.` 
  });
});

const PORT = Number(process.env.PORT) || 5000;

// Start server directly (No MongoDB)
const server = app.listen(PORT, () => {
  console.log(`🚀 Neural Newsroom Server Running (No-DB Mode) on port ${PORT}`);
});

  server.on('error', (err) => {
    console.error('[SERVER] Error:', err.message);
    if (err.code === 'EADDRINUSE') {
      console.error(
        `[SERVER] Port ${PORT} is already in use. Stop the other process (or close the old dev terminal), then try again.`
      );
      process.exit(1);
    }
  });