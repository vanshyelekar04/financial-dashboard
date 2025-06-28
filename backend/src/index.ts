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

// ✅ Enable trust proxy for Render/Vercel (helps with rate limiting & forwarded IPs)
app.set('trust proxy', 1);

// 🛡 Security middleware
app.use(helmet());

// 🔓 CORS middleware (allow all origins - for testing or public APIs)
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));

// 🧠 JSON body parser
app.use(express.json({ limit: '10kb' }));

// 🚫 Basic Rate Limiting: 100 requests / 15 minutes per IP
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

// 🔌 Connect to MongoDB
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
