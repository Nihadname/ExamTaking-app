import React from 'react';
import { Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function Dashboard() {
  const navigate = useNavigate();
  const { exams } = useSelector((state: RootState) => state.exam);

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/create-exam')}>
            Create New Exam
          </Button>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Recent Exams</Typography>
          <Grid container spacing={2}>
            {exams.map((exam) => (
              <Grid item xs={12} sm={6} md={4} key={exam.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{exam.title}</Typography>
                    <Typography color="textSecondary">{exam.description}</Typography>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate(`/exam/${exam.id}`)}
                      sx={{ mt: 2 }}
                    >
                      View Exam
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

export default Dashboard; 