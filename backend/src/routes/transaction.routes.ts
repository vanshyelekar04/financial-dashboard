// src/routes/transaction.routes.ts
import { Router } from 'express';
import {
  getTransactions,
  exportCSV,
  createTransaction,
  updateTransaction,
} from '../controllers/transaction.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', verifyToken, getTransactions);
router.get('/export', verifyToken, exportCSV);
router.post('/', verifyToken, createTransaction);
router.put('/:id', verifyToken, updateTransaction);

export default router;
