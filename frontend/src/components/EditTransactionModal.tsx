// src/components/EditTransactionModal.tsx
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, MenuItem, Box
} from '@mui/material';
import API from '../services/api';
import { useTransactionStore, Transaction } from '../store/useTransactionStore';
import { useSnackbar } from '../contexts/SnackbarContext';

interface Props {
  open: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const EditTransactionModal: React.FC<Props> = ({ open, onClose, transaction }) => {
  const { fetchTransactions } = useTransactionStore();
  const { showSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    amount: transaction.amount,
    category: transaction.category,
    status: transaction.status,
    user: transaction.user,
    date: transaction.date.split('T')[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await API.put(`/transactions/${transaction._id}`, form);
      showSnackbar('Transaction updated!', 'success');
      fetchTransactions();
      onClose();
    } catch (err) {
      showSnackbar('Update failed.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Transaction</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField name="amount" label="Amount" type="number" value={form.amount} onChange={handleChange} />
          <TextField name="category" label="Category" value={form.category} onChange={handleChange} />
          <TextField name="user" label="User" value={form.user} onChange={handleChange} />
          <TextField name="date" type="date" label="Date" value={form.date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
          <TextField name="status" label="Status" select value={form.status} onChange={handleChange}>
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>Update</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditTransactionModal;
