import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Transaction } from '../models/Transaction';

dotenv.config();

mongoose.connect(process.env.MONGO_URI!).then(async () => {
  await Transaction.deleteMany();

  await Transaction.insertMany([
    { amount: 1500, category: 'Salary', status: 'success', user: 'user1', date: new Date('2025-01-01') },
    { amount: -300, category: 'Groceries', status: 'success', user: 'user1', date: new Date('2025-01-05') },
    { amount: -1200, category: 'Rent', status: 'success', user: 'user2', date: new Date('2025-01-03') },
  ]);

  console.log('Dummy transactions inserted!');
  process.exit();
});
