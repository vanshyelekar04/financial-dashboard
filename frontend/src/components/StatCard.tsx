// src/components/StatCard.tsx
import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: SvgIconComponent;
  color?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color = '#00C853'
}) => {
  return (
    <Card
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: '#2B2D42',
        color: 'white',
        borderRadius: 3,
        boxShadow: '0 0 12px rgba(0,0,0,0.2)',
        minWidth: 220
      }}
    >
      <Box>
        <Typography variant="subtitle2" sx={{ color: '#B0BEC5' }}>
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 50,
          height: 50,
          bgcolor: color,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon sx={{ color: 'white' }} />
      </Box>
    </Card>
  );
};

export default StatCard;
