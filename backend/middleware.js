/**
 * Middleware Functions للأمان والمصادقة
 * @module middleware
 */

const jwt = require('jsonwebtoken');
const { sanitizeInput, sanitizeHTML } = require('./validators');
const config = require('./config');

const JWT_SECRET = config.JWT_SECRET;

/**
 * Authentication middleware to verify JWT tokens
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'لا يوجد رمز المصادقة',
        code: 'NO_AUTH_TOKEN'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'صيغة المصادقة غير صحيحة',
        code: 'INVALID_FORMAT'
      });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ 
          error: 'رمز المصادقة غير صالح',
          code: 'INVALID_TOKEN'
        });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'خطأ في المصادقة',
      details: error.message
    });
  }
};

/**
 * Role-based authorization middleware
 * @param {...string} allowedRoles - List of allowed roles
 * @returns {import('express').RequestHandler} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'لم يتم المصادقة' });
    }

    const userRole = req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'ليس لديك صلاحية لهذا الإجراء',
        requiredRole: allowedRoles,
        userRole: userRole
      });
    }

    next();
  };
};

// ✅ Input Sanitization Middleware
const sanitizeRequestBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizeInput(req.body[key]);
      }
    });
  }
  next();
};

// ✅ Rate Limiting (حماية من الهجمات)
const rateLimiter = (windowMs = config.RATE_LIMIT_WINDOW, maxRequests = config.RATE_LIMIT_MAX_REQUESTS) => {
  const requests = new Map();

  return (req, res, next) => {
    // Skip rate limiting only in development
    if (config.NODE_ENV === 'development') {
      return next();
    }

    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    if (!requests.has(ip)) {
      requests.set(ip, []);
    }

    const userRequests = requests.get(ip);
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ 
        error: 'عدد الطلبات كثير جداً، حاول لاحقاً',
        retryAfter: Math.ceil((recentRequests[0] + windowMs - now) / 1000)
      });
    }

    recentRequests.push(now);
    requests.set(ip, recentRequests);
    
    next();
  };
};

// ✅ Error Handler Middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'حدث خطأ داخلي في الخادم';
  const errors = err.errors || [];

  res.status(statusCode).json({
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
    ...(errors.length > 0 && { validationErrors: errors })
  });
};

// ✅ Validation Error Handler
const handleValidationError = (errors) => {
  if (errors.length === 0) return null;

  return {
    statusCode: 400,
    message: 'خطأ في البيانات المدخلة',
    code: 'VALIDATION_ERROR',
    errors: errors.map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }))
  };
};

// ✅ Logging Middleware
const requestLogger = (req, res, next) => {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
  });

  next();
};

// ✅ CORS Middleware (محسّن)
const enhancedCORS = (req, res, next) => {
  const allowedOrigins = config.CORS_ORIGINS;

  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

// ✅ Security Headers Middleware
const securityHeaders = (req, res, next) => {
  // منع XSS
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  // Strict Transport Security (HTTPS فقط)
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // Content Security Policy
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'");

  next();
};

module.exports = {
  authenticate,
  authorize,
  sanitizeRequestBody,
  rateLimiter,
  errorHandler,
  handleValidationError,
  requestLogger,
  enhancedCORS,
  securityHeaders
};
