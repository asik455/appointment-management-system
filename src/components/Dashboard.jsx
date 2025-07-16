import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Paper, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormControlLabel, 
  Switch, 
  Chip, 
  Tooltip 
} from '@mui/material';
import { Add, Edit, Delete, FilterList, Settings, Sort, Today } from '@mui/icons-material';
import { DateCalendar, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { format, isToday } from 'date-fns';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { motion } from 'framer-motion';
import AppointmentForm from './AppointmentForm';
import { toast } from 'react-toastify';
import InputAdornment from '@mui/material/InputAdornment';
import Search from '@mui/icons-material/Search';

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openForm, setOpenForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showNotifications, setShowNotifications] = useState(true);
  const [showReminders, setShowReminders] = useState(true);
  const [sortOrder, setSortOrder] = useState('asc');

  // Helper to update statuses
  function updateAppointmentStatuses(appointments) {
    const now = new Date();
    return appointments.map(apt => {
      const end = new Date(apt.end);
      if (end && !isNaN(end)) {
        if (now > end && apt.status !== 'confirmed') {
          return { ...apt, status: 'confirmed' };
        }
        if (now <= end && apt.status !== 'pending') {
          return { ...apt, status: 'pending' };
        }
      }
      return apt;
    });
  }

  useEffect(() => {
    // Load appointments from localStorage
    const stored = localStorage.getItem('appointments');
    if (stored) {
      let apts = JSON.parse(stored);
      apts = updateAppointmentStatuses(apts);
      setAppointments(apts);
      localStorage.setItem('appointments', JSON.stringify(apts));
    }
    const interval = setInterval(() => {
      setAppointments(prev => {
        const updated = updateAppointmentStatuses(prev);
        localStorage.setItem('appointments', JSON.stringify(updated));
        return updated;
      });
    }, 60000); // every minute
    return () => clearInterval(interval);
  }, []);

  const saveAppointments = (apts) => {
    setAppointments(apts);
    localStorage.setItem('appointments', JSON.stringify(apts));
  };

  // When adding a new appointment, always set status to 'pending'
  const handleAddAppointment = (appointment) => {
    const now = new Date();
    const end = new Date(appointment.end);
    const status = (end && !isNaN(end) && now > end) ? 'confirmed' : 'pending';
    const newAppointment = { ...appointment, id: Date.now(), time: appointment.start, status };
    const updated = [...appointments, newAppointment];
    saveAppointments(updated);
    setOpenForm(false);
    toast.success('Appointment added successfully');
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setOpenForm(true);
  };

  const handleUpdateAppointment = (updatedAppointment) => {
    const updated = appointments.map((apt) =>
      apt.id === updatedAppointment.id ? { ...updatedAppointment, time: updatedAppointment.start } : apt
    );
    saveAppointments(updated);
    setOpenForm(false);
    toast.success('Appointment updated successfully');
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updated = appointments.filter((apt) => apt.id !== id);
      saveAppointments(updated);
      toast.success('Appointment deleted successfully');
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(appointments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAppointments(items);
  };

  // Helper to safely format a date string
  function safeFormat(dateString, fmt) {
    const date = new Date(dateString);
    return isNaN(date) ? '' : format(date, fmt);
  }

  function getDayAppointmentsWithStatus(appointments, selectedDate) {
    // Filter appointments for the selected date
    const dayStr = safeFormat(selectedDate, 'yyyy-MM-dd');
    let dayApts = appointments.filter(apt => safeFormat(apt.start, 'yyyy-MM-dd') === dayStr);
    // Sort by start time
    dayApts = [...dayApts].sort((a, b) => new Date(a.start) - new Date(b.start));
    const now = new Date();
    const seenStartTimes = new Set();
    let ongoingIdx = -1;
    let confirmedIdx = -1;
    // First pass: assign ongoing and completed, mark duplicates
    const result = dayApts.map((apt, idx) => {
      const start = new Date(apt.start);
      const end = new Date(apt.end);
      let status = apt.status;
      const startKey = start.getTime();
      if (seenStartTimes.has(startKey)) {
        status = 'cancelled';
      } else {
        seenStartTimes.add(startKey);
        if (now >= start && now < end && ongoingIdx === -1) {
          status = 'ongoing';
          ongoingIdx = idx;
        } else if (now >= end) {
          status = 'completed';
        } else {
          status = 'pending'; // will update confirmed below
        }
      }
      return { ...apt, status };
    });
    // Second pass: assign 'confirmed' to the next future appointment if no ongoing
    if (ongoingIdx === -1) {
      const nextIdx = result.findIndex(a => a.status === 'pending');
      if (nextIdx !== -1) {
        result[nextIdx].status = 'confirmed';
      }
    }
    return result;
  }

  const filteredAppointments = appointments
    .filter((apt) => {
      const matchesSearch = apt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const isSameDate = safeFormat(apt.start, 'yyyy-MM-dd') === safeFormat(selectedDate, 'yyyy-MM-dd');
      return matchesSearch && matchesStatus && isSameDate;
    });

  // Helper to get all appointment dates as yyyy-MM-dd strings
  const appointmentDates = appointments.map(apt => safeFormat(apt.start, 'yyyy-MM-dd')).filter(Boolean);

  // Custom Day component to show a red dot if the date has an appointment
  function AppointmentDay(props) {
    const { day, outsideCurrentMonth, ...other } = props;
    const isAppointment = appointmentDates.includes(safeFormat(day, 'yyyy-MM-dd'));
    return (
      <PickersDay {...other} day={day} outsideCurrentMonth={outsideCurrentMonth} sx={{ position: 'relative' }}>
        {day.getDate()}
        {isAppointment && (
          <span style={{
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'red',
            display: 'block',
          }} />
        )}
      </PickersDay>
    );
  }

  const dayAppointments = getDayAppointmentsWithStatus(appointments, selectedDate);
  // Order: ongoing, confirmed, pending, completed, cancelled
  const orderedAppointments = [
    ...dayAppointments.filter(a => a.status === 'ongoing'),
    ...dayAppointments.filter(a => a.status === 'confirmed'),
    ...dayAppointments.filter(a => a.status === 'pending'),
    ...dayAppointments.filter(a => a.status === 'completed'),
    ...dayAppointments.filter(a => a.status === 'cancelled'),
  ];

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      position: 'fixed',
      top: 0,
      left: 0,
      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
      '&:before': {
        content: "''",
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("/images/pattern.svg")',
        opacity: 0.1,
        pointerEvents: 'none',
      },
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        mt: 2,
        width: '100%',
        maxWidth: '1400px',
        backgroundColor: 'rgba(255, 255, 255, 0.97)',
        borderRadius: 2,
        p: 2,
        boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
        margin: '0 auto',
      }}>
        <Typography variant="h4" component="h1">
          Appointment Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => setOpenForm(true)}
          startIcon={<Add />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: 2,
            '&:hover': {
              transform: 'translateY(-2px)',
            },
          }}
        >
          Add Appointment
        </Button>
      </Box>
      {showFilters && (
        <Paper
          elevation={3}
          sx={{
            mb: 3,
            p: 2,
            borderRadius: 2,
            boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
            backgroundColor: 'rgba(255,255,255,0.97)',
            width: '100%',
            maxWidth: '1400px',
            margin: '0 auto',
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ flexGrow: 1, maxWidth: '300px' }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={showNotifications}
                  onChange={(e) => setShowNotifications(e.target.checked)}
                />
              }
              label="Notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={showReminders}
                  onChange={(e) => setShowReminders(e.target.checked)}
                />
              }
              label="Reminders"
            />
          </Box>
        </Paper>
      )}

      <Box sx={{
        display: 'flex',
        gap: 3,
        flex: 1,
        position: 'relative',
        zIndex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: 2,
        p: 2,
        boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        alignItems: 'flex-start',
      }}>
        <Paper
          elevation={3}
          sx={{
            width: '320px',
            borderRadius: 3,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.98)',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 12px -2px rgba(0,0,0,0.10)',
            p: 0,
          }}
        >
          <Box sx={{
            p: 2,
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <Typography variant="h6">Calendar</Typography>
            <Tooltip title="Today">
              <IconButton onClick={() => setSelectedDate(new Date())}>
                <Today />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{
            flex: 1,
            p: 2,
            background: 'linear-gradient(135deg, #f3f4f8 0%, #e0e7ef 100%)',
            borderRadius: 2,
          }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateCalendar
                value={selectedDate}
                onChange={setSelectedDate}
                views={['day']}
                slots={{ day: AppointmentDay }}
                sx={{
                  width: '100%',
                  '& .MuiPickersDay-root': {
                    backgroundColor: '#f3f4f8',
                    borderRadius: '50%',
                    border: '1px solid #e0e7ef',
                    color: '#222',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#2563eb !important',
                    color: '#fff !important',
                  },
                  '& .MuiPickersDay-root:hover': {
                    backgroundColor: '#e0e7ef',
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            flex: 1,
            borderRadius: 3,
            overflow: 'hidden',
            background: '#fff',
            boxShadow: '0 4px 16px -2px rgba(0,0,0,0.10)',
            p: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: 320,
            justifyContent: 'flex-start',
            mt: 0,
            mb: 0,
          }}
        >
          <Box sx={{
            width: '100%',
            p: 3,
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(245,247,250,0.7)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {isToday(selectedDate)
                ? 'Appointments for today'
                : `Appointments for ${safeFormat(selectedDate, 'dd MMMM yyyy')}`}
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              {orderedAppointments.length} appointments
            </Typography>
          </Box>
          <Box sx={{ width: '100%', p: 3, pt: 2, pb: 2, maxHeight: '55vh', overflowY: 'auto' }}>
            {orderedAppointments.length === 0 && (
              <Typography variant="body1" sx={{ color: '#888', textAlign: 'center', mt: 4 }}>
                There is no appointment today.
              </Typography>
            )}
            {orderedAppointments.map((appointment, index) => (
              <Box key={appointment.id} sx={{
                mb: index !== orderedAppointments.length - 1 ? 2 : 0,
                pb: 0,
                borderBottom: index !== orderedAppointments.length - 1 ? '1px solid #f0f0f0' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 2,
              }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1, color: '#222' }}>
                    {appointment.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Patient: {appointment.patient}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Time: {safeFormat(appointment.start, 'HH:mm')}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip
                      label={appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      size="small"
                      sx={{
                        backgroundColor:
                          appointment.status === 'ongoing'
                            ? '#7c3aed'
                            : appointment.status === 'confirmed'
                            ? '#38a169'
                            : appointment.status === 'pending'
                            ? '#ff9800'
                            : appointment.status === 'completed'
                            ? '#4299e1'
                            : appointment.status === 'cancelled'
                            ? '#e53e3e'
                            : '#38a169',
                        color: '#fff',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                      }}
                    />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <IconButton size="small" onClick={() => handleEditAppointment(appointment)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDeleteAppointment(appointment.id)}>
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        </Paper>
      </Box>

      {openForm && (
        <AppointmentForm
          open={true}
          onClose={() => {
            setOpenForm(false);
            setEditingAppointment(null);
          }}
          onSubmit={editingAppointment ? handleUpdateAppointment : handleAddAppointment}
          appointment={editingAppointment}
        />
      )}
    </Box>
  );
};

export default Dashboard;
