import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Paper, Table, TableHead,
  TableRow, TableCell, TableBody, Avatar, Chip, Collapse, Stack, Divider
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

const DashboardPage: React.FC = () => {
  const store = useTransactionStore(); 
const {
  transactions, stats, filters, page, limit,
  fetchTransactions, fetchStats
} = store;

  const { logout } = useAuth();

  const [openExport, setOpenExport] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
  fetchTransactions();
  fetchStats();
}, [filters, page, limit, fetchTransactions, fetchStats]);



  const revenue = stats?.revenue || 0;
  const expenses = stats?.expenses || 0;
  const balance = stats?.totalBalance || 0;
  const savings = stats?.savings || 0;

  const colorFor = (status: string) =>
    status.toLowerCase() === 'paid' ? 'success'
      : status.toLowerCase() === 'pending' ? 'warning'
        : 'default';

  return (
    <MainLayout>
      <Topbar />

      <Paper elevation={3} sx={{ p: 4, backgroundColor: '#1e1e2f', borderRadius: 3 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={600} sx={{ color: 'text.primary' }}>
            Financial Dashboard
          </Typography>
          <Button variant="outlined" color="error" onClick={logout}>
            Logout
          </Button>
        </Box>

        {/* Stat Cards */}
        <Box display="flex" flexWrap="wrap" gap={3} justifyContent="space-between" mb={4}>
          <StatCard title="Balance" value={`$${balance.toFixed(2)}`} icon={AccountBalanceWalletIcon} color="#3A86FF" />
          <StatCard title="Revenue" value={`$${revenue.toFixed(2)}`} icon={TrendingUpIcon} color="#06D6A0" />
          <StatCard title="Expenses" value={`$${Math.abs(expenses).toFixed(2)}`} icon={TrendingDownIcon} color="#EF476F" />
          <StatCard title="Savings" value={`$${savings.toFixed(2)}`} icon={SavingsIcon} color="#FFD166" />
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
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

        {/* Filters Panel */}
        <Collapse in={showFilters}>
          <Box mb={3}>
            <TransactionFilters />
          </Box>
        </Collapse>

        {/* Table */}
        <Paper sx={{ mb: 4, bgcolor: '#2a2a3b', p: 2, borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#33334d' }}>
                {['User', 'Date', 'Amount', 'Category', 'Status'].map((header, i) => (
                  <TableCell key={i} sx={{ color: '#aaa', fontWeight: 700 }}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map(tx => (
                <TableRow
                  key={tx._id}
                  hover
                  sx={{ '&:hover': { backgroundColor: '#3c3c5c', cursor: 'pointer' } }}
                  onClick={() => {
                    setSelectedTransaction(tx);
                    setOpenEdit(true);
                  }}
                >
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar src={tx.user_profile} sx={{ bgcolor: '#4e4e77', width: 30, height: 30 }}>
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
                      sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>

        {/* Pagination + Charts */}
        <PaginationBar />
        <Divider sx={{ my: 4 }} />
        <TransactionCharts />
      </Paper>

      {/* Modals */}
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
