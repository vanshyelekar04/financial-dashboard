import React from 'react';
import { Box, InputBase, Avatar, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '../contexts/ThemeContext';

const Topbar: React.FC = () => {
  const { mode, toggleMode } = useThemeMode();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        bgcolor: 'background.paper',
        p: 1.5,
        borderRadius: 2,
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', px: 2, py: 0.5, borderRadius: 2, mr: 2 }}>
        <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <InputBase placeholder="Search..." sx={{ color: 'text.primary', width: 200 }} />
      </Box>

      <Tooltip title="Toggle theme">
        <IconButton onClick={toggleMode} sx={{ color: 'text.secondary' }}>
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
      </Tooltip>

      <IconButton sx={{ color: 'text.secondary' }}>
        <NotificationsIcon />
      </IconButton>
      <IconButton sx={{ color: 'text.secondary' }}>
        <SettingsIcon />
      </IconButton>

      <Avatar sx={{ width: 32, height: 32, ml: 2, bgcolor: 'primary.main' }}>U</Avatar>
    </Box>
  );
};

export default Topbar;
