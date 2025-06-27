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

// ✅ Enable trust proxy for Render (fixes rate limiting + forwarded IPs)
app.set('trust proxy', 1);

// 🛡 Security middleware
app.use(helmet());

// ✅ Safe CORS config for both localhost and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://financial-dashboard-frontend-fvy2.onrender.com',
  'https://financial-dashboard-evfv0adxq-vanshs-projects-15abcf20.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn('❌ Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// 🔍 Log request origins for CORS debugging
app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

// 🧠 Body parser
app.use(express.json({ limit: '10kb' }));

// 🚫 Rate limiter (limits 100 requests per 15 minutes per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// 🔗 Routes
app.get('/', (req, res) => {
  res.send('🟢 Financial Dashboard API is live!');
});
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// 🔌 MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
