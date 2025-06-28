import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import { seedTransactionsIfEmpty } from './utils/seed';
import { verifyToken } from './middlewares/auth.middleware';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for production
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

app.use(verifyToken); 

// Allow ALL origins
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api', limiter);

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send('🟢 Financial Dashboard API is live!');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// Serve manifest.json without authentication
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI || '', {
  autoIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
.then(async () => {
  console.log('✅ MongoDB connected');
  await seedTransactionsIfEmpty();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1);
});