// src/index.ts
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';
import importTransactions from './scripts/importTransactions';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔐 Security Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:3000', 
    'https://financial-dashboard-ivory-pi.vercel.app', 
    'https://financial-dashboard-git-main-vanshs-projects-15abcf20.vercel.app/',
    'https://financial-dashboard-d9dfrwscl-vanshs-projects-15abcf20.vercel.app',
    'https://financial-dashboard.vercel.app'
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));

// 🛡 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// 🌐 Routes
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 🚀 MongoDB Connection + Auto Import
mongoose
  .connect(process.env.MONGO_URI!)
  .then(async () => {
    console.log('✅ MongoDB connected');

    await importTransactions();

    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err));
