import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Required for Render (handles X-Forwarded-For header for rate-limiting)
app.set('trust proxy', 1);

// 🛡️ Security middleware
app.use(helmet());

// 🌍 CORS: Allow specific domains (frontend on Render + localhost for dev)
const allowedOrigins = [
  'http://localhost:3000',
  'https://financial-dashboard-frontend-fvy2.onrender.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

// 📋 Log request origin for debugging CORS issues
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// 🧠 JSON Parser
app.use(express.json({ limit: '10kb' }));

// 🚫 Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // max 100 requests per 15 minutes
});
app.use('/api', limiter);

// 📦 Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ⚙️ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
