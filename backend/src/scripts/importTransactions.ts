// scripts/importTransactions.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { Transaction } from '../models/Transaction';

dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('✅ MongoDB connected');

    const rawData = fs.readFileSync(path.join(__dirname, '../data/transactions.json'), 'utf-8');
    const transactions = JSON.parse(rawData);

    const formatted = transactions.map((tx: any) => ({
      _id: String(tx.id),
      date: tx.date,
      amount: tx.amount,
      category: tx.category,
      status: tx.status,
      user: tx.user_id,
      user_profile: tx.user_profile ?? '',
    }));

    await Transaction.deleteMany({});
    await Transaction.insertMany(formatted);
    console.log(`✅ Imported ${formatted.length} transactions successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to import transactions:', err);
    process.exit(1);
  }
};

run();
