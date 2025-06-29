import React from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { Typography, Paper, Box } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF605C'];

const TransactionCharts: React.FC = () => {
  const { stats } = useTransactionStore();

  if (!stats) return null;

  const pieData = Object.entries(stats.categoryBreakdown || {}).map(([name, value]) => ({ name, value }));
  const lineData = stats.lineData || [];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 4,
      mt: 4,
      width: '100%'
    }}>
      {/* Line Chart */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" mb={1}>Revenue vs Expenses</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Pie Chart */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" mb={1}>Category Breakdown</Typography>
          {pieData.length === 0 ? (
            <Typography>No data to display</Typography>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default TransactionCharts;
