import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import rewardRoutes from './routes/rewardRoutes';
import tokenRoutes from './routes/tokenRoutes';
import transactionRoutes from './routes/transactionRoutes';

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((_req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${_req.method} ${_req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/rewards', rewardRoutes);
app.use('/api/tokens', tokenRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use(
  (
    _err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error('Unhandled error:', _err);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
);

// 404 handler
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

export default app;
