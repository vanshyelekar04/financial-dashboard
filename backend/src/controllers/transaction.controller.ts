// src/controllers/transaction.controller.ts
import { Request, Response } from 'express';
import { Parser } from 'json2csv';
import { Transaction } from '../models/Transaction';

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search, category, status, user,
      minAmount, maxAmount, startDate, endDate,
      sortBy = 'date', sortOrder = 'desc',
      page = '1', limit = '10'
    } = req.query as Record<string, string>;

    const query: any = {};

    // Case-insensitive full-text search
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
      if (startDate && !isNaN(Date.parse(startDate))) query.date.$gte = new Date(startDate);
      if (endDate && !isNaN(Date.parse(endDate))) query.date.$lte = new Date(endDate);
    }

    const currentPage = Math.max(Number(page), 1);
    const perPage = Math.max(Number(limit), 1);
    const skip = (currentPage - 1) * perPage;

    const total = await Transaction.countDocuments(query);
    const sortField = sortBy;
    const sortDir = sortOrder === 'asc' ? 1 : -1;

    const transactions = await Transaction.find(query)
      .sort({ [sortField]: sortDir })
      .skip(skip)
      .limit(perPage);

    res.status(200).json({ data: transactions, total });
  } catch (err) {
    console.error('[GET TRANSACTIONS ERROR]', err);
    res.status(400).json({ message: 'Invalid query parameters or server error', error: err });
  }
};

// src/controllers/transaction.controller.ts

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { amount, category, status, user, date, user_profile } = req.body;

    const transaction = await Transaction.create({
      amount,
      category,
      status,
      user,
      date,
      user_profile,
    });

    res.status(201).json(transaction);
  } catch (error) {
    console.error('[CREATE ERROR]', error);
    res.status(500).json({ message: 'Failed to create transaction', error });
  }
};

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
  } catch (error) {
    console.error('[UPDATE ERROR]', error);
    res.status(500).json({ message: 'Failed to update transaction', error });
  }
};



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
  } catch (err) {
    console.error('[EXPORT CSV ERROR]', err);
    res.status(500).json({ message: 'CSV generation failed', error: err });
  }
};
