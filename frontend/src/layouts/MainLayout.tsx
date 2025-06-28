import React from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from '../components/Sidebar';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex'}}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          overflowX: 'hidden',
          bgcolor: 'background.default',
          pt:2,
          px: 3,
          pb: 4,
        }}
      >

        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
