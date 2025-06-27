import React from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { getChartData } from '../utils/chartUtils';
import { Typography, Paper, Box } from '@mui/material';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF605C'];

const TransactionCharts: React.FC = () => {
  const { transactions } = useTransactionStore();
  const { lineData, pieData } = getChartData(transactions);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      gap: 4,
      mt: 4,
      width: '100%'
    }}>
      {/* Revenue vs Expenses Chart */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6">Revenue vs Expenses</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Category Breakdown Chart */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Paper sx={{ p: 2, height: '100%' }}>
          {pieData.length === 0 ? (
            <Typography variant="body2">No data to display</Typography>
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
