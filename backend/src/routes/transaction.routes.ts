import { Router } from 'express';
import {
  getTransactions,
  getTransactionStats,
  exportCSV,
  createTransaction,
  updateTransaction,
} from '../controllers/transaction.controller';
import { verifyToken } from '../middlewares/auth.middleware';


const router = Router();

router.get('/', verifyToken, getTransactions);
router.get('/stats', verifyToken, getTransactionStats);
router.get('/export', verifyToken, exportCSV);
router.post('/', verifyToken, createTransaction);
router.put('/:id', verifyToken, updateTransaction);

export default router;
