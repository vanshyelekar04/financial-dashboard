import React, { useState } from 'react';
import { Box, TextField, MenuItem, Button } from '@mui/material';
import { useTransactionStore } from '../store/useTransactionStore';

const TransactionFilters: React.FC = () => {
  const { setFilters, fetchTransactions, setLimit } = useTransactionStore();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [user, setUser] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');


  const apply = () => {
    setFilters({
      search,
      category,
      status,
      user,
      minAmount: minAmount ? Number(minAmount) : undefined,
      maxAmount: maxAmount ? Number(maxAmount) : undefined,
      startDate: start || undefined,
      endDate: end || undefined,
      sortBy,
      sortOrder
    });
    fetchTransactions();
  };

  const clear = () => {
    setSearch(''); setCategory(''); setStatus(''); setUser('');
    setMinAmount(''); setMaxAmount(''); setStart(''); setEnd('');
    setSortBy('date'); setSortOrder('desc');
    setFilters({});
    fetchTransactions();
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
      <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
      <TextField label="Category" value={category} onChange={e => setCategory(e.target.value)} />
      <TextField select label="Status" value={status} onChange={e => setStatus(e.target.value)} sx={{ minWidth: 120 }}>
        <MenuItem value="">All</MenuItem>
        <MenuItem value="Paid">Paid</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>

      </TextField>
      <TextField label="User" value={user} onChange={e => setUser(e.target.value)} />
      <TextField label="Min Amount" type="number" value={minAmount} onChange={e => setMinAmount(e.target.value)} />
      <TextField label="Max Amount" type="number" value={maxAmount} onChange={e => setMaxAmount(e.target.value)} />
      <TextField label="Start Date" type="date" InputLabelProps={{ shrink: true }} value={start} onChange={e => setStart(e.target.value)} />
      <TextField label="End Date" type="date" InputLabelProps={{ shrink: true }} value={end} onChange={e => setEnd(e.target.value)} />
      <TextField select label="Sort By" value={sortBy} onChange={e => setSortBy(e.target.value)}><MenuItem value="date">Date</MenuItem><MenuItem value="amount">Amount</MenuItem><MenuItem value="category">Category</MenuItem><MenuItem value="status">Status</MenuItem></TextField>
      <TextField select label="Order" value={sortOrder} onChange={e => setSortOrder(e.target.value as 'asc' | 'desc')}><MenuItem value="asc">Asc</MenuItem><MenuItem value="desc">Desc</MenuItem></TextField>
      <TextField
        label="Records"
        select
        defaultValue={10}
        onChange={(e) => {
          setLimit(Number(e.target.value));
          fetchTransactions();
        }}
      >
        {[5, 10, 20, 50, 100].map((num) => (
          <MenuItem key={num} value={num}>
            {num} / page
          </MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={apply}>Apply</Button>
      <Button variant="outlined" color="secondary" onClick={clear}>Clear</Button>
    </Box>
  );
};

export default TransactionFilters;
