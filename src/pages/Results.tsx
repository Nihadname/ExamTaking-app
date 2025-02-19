import React, { useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { CheckCircle, Cancel, Timer } from '@mui/icons-material';

function Results() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = useSelector((state: RootState) => 
    state.exam.exams.find(e => e.id === examId)
  );
  const submission = useSelector((state: RootState) => 
    state.exam.submissions.find(s => s.examId === examId)
  );

  useEffect(() => {
    if (!exam && !submission) {
      navigate('/');
    }
  }, [exam, submission, navigate]);

  if (!exam || !submission) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalPoints = exam.questions.reduce((sum, q) => sum + q.points, 0);
  const percentageScore = (submission.score / totalPoints) * 100;

  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', py: 3 }}>
      {/* Overall Score Card */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                  variant="determinate"
                  value={percentageScore}
                  size={120}
                  color={percentageScore >= 60 ? "success" : "error"}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h6">{Math.round(percentageScore)}%</Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" gutterBottom>{exam.title}</Typography>
              <Typography color="textSecondary" gutterBottom>
                Score: {submission.score} / {totalPoints} points
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Timer fontSize="small" />
                <Typography>
                  Time Spent: {Math.floor(submission.timeSpent / 60)}:{(submission.timeSpent % 60).toString().padStart(2, '0')}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Detailed Results */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Question</TableCell>
              <TableCell>Your Answer</TableCell>
              <TableCell>Correct Answer</TableCell>
              <TableCell align="center">Points</TableCell>
              <TableCell align="center">Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {exam.questions.map((question, index) => {
              const userAnswer = submission.answers.find(a => a.questionId === question.id)?.answer;
              const isCorrect = userAnswer === question.correctAnswer;

              return (
                <TableRow key={question.id}>
                  <TableCell>
                    <Typography variant="body2" gutterBottom>
                      {index + 1}. {question.text}
                    </Typography>
                    {question.image && (
                      <img 
                        src={question.image} 
                        alt="Question" 
                        style={{ maxWidth: 200, maxHeight: 100 }} 
                      />
                    )}
                  </TableCell>
                  <TableCell>{userAnswer || 'No answer'}</TableCell>
                  <TableCell>{question.correctAnswer}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={`${isCorrect ? question.points : 0}/${question.points}`}
                      color={isCorrect ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {isCorrect ? (
                      <CheckCircle color="success" />
                    ) : (
                      <Cancel color="error" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Button component={Link} to={`/detailed-results/${examId}`} variant="contained" color="primary" sx={{ mt: 2 }}>
        View Detailed Results
      </Button>
    </Box>
  );
}

export default Results; 