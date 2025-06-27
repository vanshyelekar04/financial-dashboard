import { createTheme } from '@mui/material/styles';

export const getTheme = (mode: 'light' | 'dark') =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#1C1C28',
              paper: '#252537',
            },
            text: {
              primary: '#fff',
            },
          }
        : {
            background: {
              default: '#f5f5f5',
              paper: '#fff',
            },
            text: {
              primary: '#000',
            },
          }),
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
    },
  });
