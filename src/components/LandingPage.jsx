import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      minWidth: '100vw',
      width: '100vw',
      height: '100vh',
      pt: 8,
      position: 'relative',
      overflow: 'hidden',
      background: `linear-gradient(135deg, rgba(255,255,255,0.75) 40%, rgba(255,255,255,0.4) 100%), url('https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=1500&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#2d3748' }}>
            Schedule Your Appointments
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Manage your appointments with ease using our intuitive interface
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleGetStarted}
            sx={{
              mt: 4,
              px: 6,
              py: 2,
              bgcolor: '#4299e1',
              '&:hover': {
                bgcolor: '#3182ce',
              },
            }}
          >
            Get Started
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4299e1' }}>
                Easy Scheduling
              </Typography>
              <Typography color="text.secondary">
                Schedule appointments quickly and easily with our intuitive interface
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4299e1' }}>
                Real-time Updates
              </Typography>
              <Typography color="text.secondary">
                Get real-time updates on your appointments and schedule changes
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 4, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#4299e1' }}>
                Mobile Friendly
              </Typography>
              <Typography color="text.secondary">
                Access your appointments from anywhere using our mobile-responsive design
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LandingPage;