import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, FormControlLabel, Checkbox, Box
} from '@mui/material';
import API from '../services/api';
import { useSnackbar } from '../contexts/SnackbarContext';

const allFields = ['amount', 'category', 'date', 'user', 'status'];

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

const ExportModal: React.FC<ExportModalProps> = ({ open, onClose }) => {
  const [selectedFields, setSelectedFields] = useState<string[]>(allFields);
  const { showSnackbar } = useSnackbar();

  const toggleField = (field: string) => {
    setSelectedFields(prev =>
      prev.includes(field)
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  const handleExport = async () => {
    try {
      const response = await API.get('/transactions/export', {
        params: { fields: selectedFields.join(',') },
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'financial_report.csv';
      a.click();
      window.URL.revokeObjectURL(url);

      showSnackbar('CSV exported successfully!', 'success');
      onClose();
    } catch {
      showSnackbar('Export failed. Please try again.', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Select Fields to Export</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column">
          {allFields.map(field => (
            <FormControlLabel
              key={field}
              control={
                <Checkbox
                  checked={selectedFields.includes(field)}
                  onChange={() => toggleField(field)}
                />
              }
              label={field.charAt(0).toUpperCase() + field.slice(1)}
            />
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleExport}>Export</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportModal;
