/**
 * Configuration - Environment Variables Setup
 */

require('dotenv').config();

const config = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'yas-super-secret-key-2026-development',
  JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
  
  // CORS & URLs
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Database
  DB_PATH: process.env.DB_PATH || './db.json',
  
  // Security
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
  PASSWORD_MIN_LENGTH: 8,
  
  // Email (optional)
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'mock',
  EMAIL_FROM: process.env.EMAIL_FROM || 'noreply@opsmind.com',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  
  // App Info
  APP_NAME: 'OPSMind',
  APP_VERSION: '1.0.0',
};

// Validate critical config
const validateConfig = () => {
  const required = ['JWT_SECRET', 'FRONTEND_URL', 'CORS_ORIGIN'];
  for (const key of required) {
    if (!config[key]) {
      console.warn(`⚠️ Missing ${key} - using default`);
    }
  }
  
  if (config.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('development')) {
      console.error('❌ PRODUCTION: Please set a strong JWT_SECRET!');
      process.exit(1);
    }
  }
};

validateConfig();

module.exports = config;
