import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function DetailedResults() {
  const { examId } = useParams();
  const { submissions, exams } = useSelector((state: RootState) => state.exam);
  const submission = submissions.find(s => s.examId === examId);

  if (!submission) {
    return <Typography variant="h6">No results found for this exam.</Typography>;
  }

  const exam = exams.find(e => e.id === examId);

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
      <Typography variant="h4" gutterBottom>{exam?.title} - Detailed Results</Typography>
      <Card>
        <CardContent>
          <Typography variant="h6">Your Answers</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Question</TableCell>
                <TableCell>Your Answer</TableCell>
                <TableCell>Correct Answer</TableCell>
                <TableCell>Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exam?.questions.map((question) => {
                const userAnswer = submission.answers.find(a => a.questionId === question.id)?.answer;
                const isCorrect = userAnswer === question.correctAnswer;

                return (
                  <TableRow key={question.id}>
                    <TableCell>{question.text}</TableCell>
                    <TableCell>{userAnswer || 'No Answer'}</TableCell>
                    <TableCell>{question.correctAnswer}</TableCell>
                    <TableCell>
                      <Chip label={isCorrect ? 'Correct' : 'Incorrect'} color={isCorrect ? 'success' : 'error'} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}

export default DetailedResults; 