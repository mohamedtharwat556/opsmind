/**
 * Health Check Endpoint
 */

const config = require('./config');

const healthRouter = (express) => {
  const router = express.Router();

  // Health check
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: config.NODE_ENV,
      app: config.APP_NAME,
      version: config.APP_VERSION
    });
  });

  // Version check
  router.get('/version', (req, res) => {
    res.status(200).json({
      app: config.APP_NAME,
      version: config.APP_VERSION,
      nodeEnv: config.NODE_ENV,
      timestamp: new Date().toISOString()
    });
  });

  // Server info (admin only)
  router.get('/info', (req, res) => {
    res.status(200).json({
      app: config.APP_NAME,
      version: config.APP_VERSION,
      nodeEnv: config.NODE_ENV,
      nodeVersion: process.version,
      platform: process.platform,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString()
    });
  });

  return router;
};

module.exports = healthRouter;
