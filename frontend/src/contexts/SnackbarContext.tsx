import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';

type SnackbarType = 'success' | 'error' | 'info' | 'warning';

interface Props { children: React.ReactNode; }
interface ContextProps { showSnackbar: (msg: string, type?: SnackbarType) => void; }

const SnackbarContext = createContext<ContextProps>({ showSnackbar: () => {} });

export const SnackbarProvider: React.FC<Props> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('info');

  const showSnackbar = (msg: string, severity: SnackbarType = 'info') => {
    setMessage(msg);
    setType(severity);
    setOpen(true);
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert severity={type} onClose={() => setOpen(false)}>{message}</Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
};

export const useSnackbar = () => useContext(SnackbarContext);
