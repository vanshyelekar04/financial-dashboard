import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Avatar, Chip, Collapse, Stack
} from '@mui/material';
import {
  ExpandLess, ExpandMore
} from '@mui/icons-material';
import { useTransactionStore, Transaction } from '../store/useTransactionStore';
import { useAuth } from '../contexts/AuthContext';
import TransactionFilters from '../components/TransactionFilters';
import TransactionCharts from '../components/TransactionCharts';
import ExportModal from '../components/ExportModal';
import PaginationBar from '../components/PaginationBar';
import StatCard from '../components/StatCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsIcon from '@mui/icons-material/Savings';
import MainLayout from '../layouts/MainLayout';
import Topbar from '../components/Topbar';
import AddTransactionModal from '../components/AddTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import { useNavigate } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { transactions, fetchTransactions } = useTransactionStore();
  const { logout, isAuthenticated, token } = useAuth(); // ✅ Include token
  const navigate = useNavigate();

  const [openExport, setOpenExport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // ✅ Only fetch data when token is available
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (token) {
      fetchTransactions();
    }
  }, [isAuthenticated, token]);

  const revenue = transactions.filter(tx => tx.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const expenses = transactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + tx.amount, 0);
  const balance = revenue + expenses;
  const savings = revenue * 0.2;

  const colorFor = (status: string) =>
    status.toLowerCase() === 'paid' ? 'success'
      : status.toLowerCase() === 'pending' ? 'warning'
        : 'default';

  return (
    <MainLayout>
      <Topbar />

      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ px: 0, pt: 0, pb: 3, mt: 0 }}>
        <Typography variant="h4" sx={{ color: 'text.primary' }}>Dashboard</Typography>
        <Button variant="outlined" color="secondary" onClick={logout}>Logout</Button>
      </Box>

      <Box display="flex" flexWrap="wrap" gap={3} mb={4}>
        <StatCard title="Balance" value={`$${balance.toFixed(2)}`} icon={AccountBalanceWalletIcon} color="#3A86FF" />
        <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} icon={TrendingUpIcon} color="#06D6A0" />
        <StatCard title="Expenses" value={`$${Math.abs(expenses).toFixed(2)}`} icon={TrendingDownIcon} color="#EF476F" />
        <StatCard title="Savings" value={`$${savings.toFixed(2)}`} icon={SavingsIcon} color="#FFD166" />
      </Box>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
          onClick={() => setShowFilters(prev => !prev)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>

        <Button variant="outlined" onClick={() => setOpenAdd(true)}>
          Add Transaction
        </Button>

        <Button variant="contained" color="primary" onClick={() => setOpenExport(true)}>
          Export CSV
        </Button>
      </Stack>

      <Collapse in={showFilters}>
        <Box mb={3}>
          <TransactionFilters />
        </Box>
      </Collapse>

      <Paper sx={{ mb: 4, p: 2, bgcolor: '#252537' }}>
        <Table>
          <TableHead>
            <TableRow>
              {['User', 'Date', 'Amount', 'Category', 'Status'].map((header, i) => (
                <TableCell key={i} sx={{ color: '#aaa', fontWeight: 600 }}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map(tx => (
              <TableRow
                key={tx._id}
                sx={{ '&:hover': { bgcolor: '#2e2f42', cursor: 'pointer' } }}
                onClick={() => {
                  setSelectedTransaction(tx);
                  setOpenEdit(true);
                }}
              >
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar src={tx.user_profile} sx={{ bgcolor: '#4e4e77' }}>
                      {tx.user.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography sx={{ color: 'text.primary' }}>{tx.user}</Typography>
                  </Box>
                </TableCell>
                <TableCell sx={{ color: 'text.primary' }}>
                  {new Date(tx.date).toLocaleDateString()}
                </TableCell>
                <TableCell sx={{
                  color: tx.amount >= 0 ? '#06D6A0' : '#EF476F',
                  fontWeight: 600
                }}>
                  {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toFixed(2)}
                </TableCell>
                <TableCell sx={{ color: 'text.primary' }}>{tx.category}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.status}
                    size="small"
                    color={colorFor(tx.status)}
                    sx={{ textTransform: 'capitalize' }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <PaginationBar />
      <TransactionCharts />

      <ExportModal open={openExport} onClose={() => setOpenExport(false)} />
      <AddTransactionModal open={openAdd} onClose={() => setOpenAdd(false)} />
      {selectedTransaction && (
        <EditTransactionModal
          open={openEdit}
          onClose={() => setOpenEdit(false)}
          transaction={selectedTransaction}
        />
      )}
    </MainLayout>
  );
};

export default DashboardPage;
