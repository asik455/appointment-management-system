import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Box, CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import './styles.css';

const NAV = {
  LANDING: 'landing',
  AUTH: 'auth',
  APPOINTMENTS: 'appointments',
  ABOUT: 'about',
  SETTINGS: 'settings',
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
});

function App() {
  const [page, setPage] = useState(NAV.LANDING);
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem('appointments')) || []
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleAuthSuccess = (userObj) => {
    setUser(userObj);
    setPage(NAV.APPOINTMENTS);
  };
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setPage(NAV.LANDING);
  };

  const addAppointment = (appt) => {
    setAppointments([...appointments, appt]);
  };
  const deleteAppointment = (id) => {
    toast.error('Delete this appointment?', {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onConfirm: () => setAppointments(appointments.filter((appt) => appt.id !== id)),
      onCancel: () => {}
    });
  };
  const editAppointment = (appt) => {
    toast('Edit appointment details?', {
      position: "top-right",
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      onConfirm: () => {
        const newName = prompt('Edit Client Name', appt.name);
        const newDatetime = prompt('Edit Date/Time', appt.datetime);
        const newReason = prompt('Edit Reason', appt.reason);
        if (newName && newDatetime && newReason) {
          setAppointments(
            appointments.map((a) =>
              a.id === appt.id
                ? { ...a, name: newName, datetime: newDatetime, reason: newReason }
                : a
            )
          );
        }
      },
      onCancel: () => {}
    });
  };

  const handleCreateAppointment = () => {
    setIsCreating(true);
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditing(true);
  };

  const handleDeleteAppointment = (id) => {
    toast.error('Delete appointment');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <DndProvider backend={HTML5Backend}>
          <Container maxWidth="lg">
            <Box sx={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
            }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Box>
          </Container>
        </DndProvider>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
};

export default App;