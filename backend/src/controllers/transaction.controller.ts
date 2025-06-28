import { Request, Response } from 'express';
import { Parser } from 'json2csv';
import { Transaction } from '../models/Transaction';
import { v4 as uuidv4 } from 'uuid';

// ✅ Get filtered + paginated transactions (Table)
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search, category, status, user,
      minAmount, maxAmount, startDate, endDate,
      sortBy = 'date', sortOrder = 'desc',
      page = '1', limit = '10'
    } = req.query as Record<string, string>;

    const query: any = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { user: regex },
        { category: regex },
        { status: regex },
      ];
    }

    if (category) query.category = new RegExp(category, 'i');
    if (status) query.status = new RegExp(status, 'i');
    if (user) query.user = new RegExp(user, 'i');

    if (!isNaN(Number(minAmount)) || !isNaN(Number(maxAmount))) {
      query.amount = {};
      if (!isNaN(Number(minAmount))) query.amount.$gte = Number(minAmount);
      if (!isNaN(Number(maxAmount))) query.amount.$lte = Number(maxAmount);
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate && !isNaN(Date.parse(startDate))) query.date.$gte = new Date(startDate);
      if (endDate && !isNaN(Date.parse(endDate))) query.date.$lte = new Date(endDate);
    }

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * perPage;
    const sortField = sortBy;
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const total = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(perPage);

    res.status(200).json({ data: transactions, total });
  } catch (err: any) {
    console.error('[GET TRANSACTIONS ERROR]', err.message || err);
    res.status(400).json({ message: 'Invalid query parameters or server error', error: err.message || err });
  }
};

// ✅ Get full DB stats for cards + charts
export const getTransactionStats = async (req: Request, res: Response) => {
  try {
    const {
      search, category, status, user,
      minAmount, maxAmount, startDate, endDate
    } = req.query as Record<string, string>;

    const query: any = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { user: regex },
        { category: regex },
        { status: regex },
      ];
    }

    if (category) query.category = new RegExp(category, 'i');
    if (status) query.status = new RegExp(status, 'i');
    if (user) query.user = new RegExp(user, 'i');

    if (!isNaN(Number(minAmount)) || !isNaN(Number(maxAmount))) {
      query.amount = {};
      if (!isNaN(Number(minAmount))) query.amount.$gte = Number(minAmount);
      if (!isNaN(Number(maxAmount))) query.amount.$lte = Number(maxAmount);
    }

    if ((startDate && !isNaN(Date.parse(startDate))) ||
        (endDate && !isNaN(Date.parse(endDate)))) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const allTx = await Transaction.find(query);

    const revenue = allTx.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
    const expenses = allTx.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
    const balance = revenue + expenses;
    const savings = revenue * 0.2;

    const categoryBreakdown: Record<string, number> = {};
    allTx.forEach(tx => {
      if (tx.category) {
        categoryBreakdown[tx.category] = (categoryBreakdown[tx.category] || 0) + Math.abs(tx.amount);
      }
    });

    res.status(200).json({
      revenue,
      expenses,
      totalBalance: balance,
      savings,
      categoryBreakdown
    });
  } catch (err: any) {
    console.error('[GET STATS ERROR]', err.message || err);
    res.status(500).json({ message: 'Failed to get transaction stats', error: err.message || err });
  }
};

// ✅ Create a new transaction
export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id, amount, category, status, user, date, user_profile } = req.body;

    const transaction = await Transaction.create({
      _id: _id || uuidv4(),
      amount,
      category,
      status,
      user,
      date,
      user_profile,
    });

    res.status(201).json(transaction);
  } catch (error: any) {
    console.error('[CREATE ERROR]', error.message || error);
    res.status(500).json({ message: 'Failed to create transaction', error: error.message || error });
  }
};

// ✅ Update a transaction
export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await Transaction.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    res.status(200).json(updated);
  } catch (error: any) {
    console.error('[UPDATE ERROR]', error.message || error);
    res.status(500).json({ message: 'Failed to update transaction', error: error.message || error });
  }
};

// ✅ Export transactions to CSV
export const exportCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const fields = (req.query.fields as string)?.split(',') ||
      ['amount', 'category', 'date', 'user', 'status'];

    const transactions = await Transaction.find().limit(1000);
    const parser = new Parser({ fields });

    const records = transactions.map(tx => ({
      ...tx.toObject(),
      date: tx.date.toISOString().split('T')[0],
    }));

    const csv = parser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename=report.csv');
    res.status(200).send(csv);
  } catch (err: any) {
    console.error('[EXPORT CSV ERROR]', err.message || err);
    res.status(500).json({ message: 'CSV generation failed', error: err.message || err });
  }
};
