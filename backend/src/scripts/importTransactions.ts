// src/scripts/importOnStartup.ts
import fs from 'fs';
import path from 'path';
import { Transaction } from '../models/Transaction';

const importTransactions = async () => {
  try {
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

    console.log(`✅ Auto-imported ${formatted.length} transactions.`);
  } catch (err) {
    console.error('❌ Auto-import failed:', err);
  }
};

export default importTransactions;
