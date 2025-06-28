import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/auth.routes';
import transactionRoutes from './routes/transaction.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// 🛡 Security
app.use(helmet());

// 🔓 CORS (Allow all origins)
app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

// 🚫 Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use('/api', limiter);

// Public file serving (must be before route protection)
app.use(express.static(path.join(__dirname, 'public')));

// Explicit route for manifest.json (optional)
app.get('/manifest.json', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'manifest.json'));
});

// Routes
app.get('/', (req, res) => {
  res.send('🟢 Financial Dashboard API is live!');
});

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

// MongoDB
mongoose.connect(process.env.MONGO_URI || '')
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
