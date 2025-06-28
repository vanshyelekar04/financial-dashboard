import fs from 'fs';
import path from 'path';
import { Transaction } from '../models/Transaction';

export const seedTransactionsIfEmpty = async () => {
  const count = await Transaction.countDocuments();

  if (count > 0) {
    console.log('🟡 Transactions already exist. Skipping seed.');
    return;
  }

  const rawData = fs.readFileSync(
    path.join(__dirname, '../../data/transactions.json'),
    'utf-8'
  );

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

  await Transaction.insertMany(formatted);
  console.log(`✅ Seeded ${formatted.length} transactions`);
};
