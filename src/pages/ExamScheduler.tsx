import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const localizer = momentLocalizer(moment);

function ExamScheduler() {
  const { exams } = useSelector((state: RootState) => state.exam);
  const [events, setEvents] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);

  useEffect(() => {
    // Load existing exams into events
    const examEvents = exams.map(exam => ({
      id: exam.id,
      title: exam.title,
      start: new Date(), // Set to exam start time
      end: new Date(), // Set to exam end time
    }));
    setEvents(examEvents);
  }, [exams]);

  const handleSelect = (event: any) => {
    setSelectedEvent(event);
    setOpen(true);
    setTitle(event.title);
    setStart(event.start);
    setEnd(event.end);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  const handleSave = () => {
    // Save the event (you can also integrate with Google Calendar here)
    const newEvent = {
      title,
      start,
      end,
    };
    setEvents([...events, newEvent]);
    handleClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam Scheduler
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        onSelectEvent={handleSelect}
        selectable
        onSelectSlot={(slotInfo) => {
          setStart(slotInfo.start);
          setEnd(slotInfo.end);
          setOpen(true);
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{selectedEvent ? 'Edit Exam' : 'Schedule Exam'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Exam Title"
            type="text"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="datetime-local"
            fullWidth
            value={start ? start.toISOString().slice(0, 16) : ''}
            onChange={(e) => setStart(new Date(e.target.value))}
          />
          <TextField
            margin="dense"
            label="End Time"
            type="datetime-local"
            fullWidth
            value={end ? end.toISOString().slice(0, 16) : ''}
            onChange={(e) => setEnd(new Date(e.target.value))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExamScheduler; 