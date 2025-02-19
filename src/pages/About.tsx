import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function About() {
  return (
    <Box sx={{ p: 3, backgroundColor: '#e3f2fd' }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          About the Exam System
        </Typography>
        <Typography variant="body1" paragraph>
          The Exam System is designed to facilitate the creation, administration, and evaluation of exams. 
          Our platform provides a user-friendly interface for both teachers and students, allowing for 
          seamless exam management and tracking.
        </Typography>
        <Typography variant="body1" paragraph>
          Key features include:
        </Typography>
        <ul>
          <li>Easy exam creation with customizable questions</li>
          <li>Real-time tracking of student performance</li>
          <li>Detailed results and feedback for each exam</li>
          <li>Secure login and registration process</li>
        </ul>
      </Paper>
    </Box>
  );
}

export default About; 