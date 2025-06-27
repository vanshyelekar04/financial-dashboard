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

// ✅ Allowed frontend origins (add more if needed)
const allowedOrigins = [
  'http://localhost:3000',
  'https://financial-dashboard-frontend-fvy2.onrender.com',
];

// 🔐 Security Headers
app.use(helmet());

// 🌐 Enable CORS with dynamic origin checking
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

// 🧪 Debug: log origin (optional, for troubleshooting)
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// 📦 Parse JSON requests
app.use(express.json({ limit: '10kb' }));

// 🛡 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP
});
app.use('/api', limiter);

// 🚀 API Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// ⚡ MongoDB Connection and Server Start
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
