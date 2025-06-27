import React from 'react';
import { Pagination, Stack } from '@mui/material';
import { useTransactionStore } from '../store/useTransactionStore';

const PaginationBar: React.FC = () => {
  const { total, limit, page, setPage, fetchTransactions } = useTransactionStore();
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    fetchTransactions();
  };

  return (
    <Stack alignItems="center" sx={{ my: 4 }}>
      <Pagination count={totalPages} page={page} onChange={handleChange} color="primary" />
    </Stack>
  );
};

export default PaginationBar;
