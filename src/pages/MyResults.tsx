import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Button
} from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { Link } from 'react-router-dom';

function MyResults() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { exams, submissions } = useSelector((state: RootState) => state.exam);

  // Add these console logs
  console.log('Current user:', user);
  console.log('All submissions:', submissions);
  console.log('User ID:', user?.id);

  // Filter submissions for current user
  const mySubmissions = submissions.filter(s => s.userId === user?.id);
  console.log('My submissions:', mySubmissions);

  if (mySubmissions.length === 0) {
    return (
      <Box sx={{ maxWidth: 1000, mx: 'auto', py: 3 }}>
        <Typography variant="h5" gutterBottom>My Exam Results</Typography>
        <Alert severity="info">You haven't taken any exams yet.</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 3 }}>
      <Typography variant="h5" gutterBottom>My Exam Results</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Title</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Time Spent</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mySubmissions.map((submission) => {
              const exam = exams.find(e => e.id === submission.examId);
              const totalPoints = exam?.questions.reduce((sum, q) => sum + q.points, 0) || 0;
              const percentage = (submission.score / totalPoints) * 100;

              return (
                <TableRow key={submission.id}>
                  <TableCell>{exam?.title || 'Unknown Exam'}</TableCell>
                  <TableCell>
                    <Chip
                      label={`${submission.score}/${totalPoints} (${Math.round(percentage)}%)`}
                      color={percentage >= 60 ? "success" : "error"}
                    />
                  </TableCell>
                  <TableCell>
                    {Math.floor(submission.timeSpent / 60)}:{(submission.timeSpent % 60).toString().padStart(2, '0')}
                  </TableCell>
                  <TableCell>
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button 
                      component={Link} 
                      to={`/detailed-results/${submission.examId}`} 
                      variant="outlined" 
                      color="primary"
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default MyResults; 