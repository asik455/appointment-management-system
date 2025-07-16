import React, { useState } from 'react';
import { Box, Paper, TextField, Button, Typography, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { motion } from 'framer-motion';
import { Close, CheckCircle, Error } from '@mui/icons-material';

const AppointmentForm = ({ onClose, onSubmit, appointment }) => {
  const [formData, setFormData] = useState({
    title: appointment?.title || '',
    patient: appointment?.patient || '',
    start: appointment?.start || '',
    end: appointment?.end || '',
    description: appointment?.description || '',
    status: appointment?.status || 'confirmed'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.patient || !formData.start || !formData.end) {
      alert('Please fill all required fields');
      return;
    }

    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6">
          {appointment ? 'Edit Appointment' : 'New Appointment'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Appointment Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              label="Patient Name"
              name="patient"
              value={formData.patient}
              onChange={handleChange}
              required
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label="Start Time"
                name="start"
                type="datetime-local"
                value={formData.start}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
              <TextField
                fullWidth
                label="End Time"
                name="end"
                type="datetime-local"
                value={formData.end}
                onChange={handleChange}
                required
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Description"
              name="description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: '#718096' }}>
                Status:
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  color: formData.status === 'confirmed' ? '#38a169' : '#e53e3e',
                  fontWeight: 600,
                }}
              >
                {formData.status}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            variant="outlined"
            onClick={onClose}
            startIcon={<Close />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={appointment ? <CheckCircle /> : <Close />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              bgcolor: '#4299e1',
              '&:hover': {
                bgcolor: '#63b3ed',
              },
            }}
          >
            {appointment ? 'Update' : 'Create'} Appointment
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AppointmentForm;