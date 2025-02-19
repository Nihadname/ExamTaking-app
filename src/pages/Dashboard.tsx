import React from 'react';
import { Button, Grid, Typography, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { exams, submissions } = useSelector((state: RootState) => state.exam);

  const teacherStats = {
    totalExams: exams.length,
    totalSubmissions: submissions.length,
    averageScore: submissions.length > 0 
      ? submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length 
      : 0
  };

  const calculatePersonalAverage = () => {
    const mySubmissions = submissions.filter(s => s.userId === user?.id);
    return mySubmissions.length > 0
      ? mySubmissions.reduce((acc, sub) => acc + sub.score, 0) / mySubmissions.length
      : 0;
  };

  const studentStats = {
    examsCompleted: submissions.filter(s => s.userId === user?.id).length,
    averageScore: calculatePersonalAverage(),
    upcomingExams: exams.filter(e => !submissions.some(s => s.examId === e.id && s.userId === user?.id))
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Dashboard</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/create-exam')}>
            Create New Exam
          </Button>
        </Grid>
        
        {/* Teacher Stats */}
        {user?.role === 'teacher' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Teacher Statistics</Typography>
                <Typography>Total Exams: {teacherStats.totalExams}</Typography>
                <Typography>Total Submissions: {teacherStats.totalSubmissions}</Typography>
                <Typography>Average Score: {teacherStats.averageScore.toFixed(2)}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Student Stats */}
        {user?.role === 'student' && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6">Student Statistics</Typography>
                <Typography>Exams Completed: {studentStats.examsCompleted}</Typography>
                <Typography>Average Score: {studentStats.averageScore.toFixed(2)}</Typography>
                <Typography>Upcoming Exams: {studentStats.upcomingExams.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Recent Exams */}
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