import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  TextField,
  Card,
  CardContent,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { Timer, Warning } from '@mui/icons-material';
import { ExamSubmission } from '../types';
import { addSubmission } from '../store/slices/examSlice';

function ExamTaking() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const exam = useSelector((state: RootState) => 
    state.exam.exams.find(e => e.id === examId)
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(exam ? exam.duration * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!exam) {
      navigate('/');
      return;
    }

    let timer: NodeJS.Timeout;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          if (newTime <= 0) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [exam, timeLeft]);

  if (!exam) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const submission: ExamSubmission = {
      id: Date.now().toString(),
      examId: exam.id,
      userId: user?.id || '',
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      })),
      score: calculateScore(),
      timeSpent: exam.duration * 60 - timeLeft,
      submittedAt: new Date().toISOString()
    };

    dispatch(addSubmission(submission));
    
    console.log('Submission:', submission);
    console.log('Current submissions:', localStorage.getItem('submissions'));

    navigate(`/results/${exam.id}`);
  };

  const calculateScore = () => {
    let score = 0;
    exam.questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.points;
      }
    });
    return score;
  };

  const currentQuestionData = exam.questions[currentQuestion];

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 3 }}>
      {/* Timer and Progress */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              <Timer sx={{ mr: 1, verticalAlign: 'middle' }} />
              Time Left: {formatTime(timeLeft)}
            </Typography>
            <Chip 
              label={`Question ${currentQuestion + 1}/${exam.questions.length}`}
              color="primary"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion + 1) * 100 / exam.questions.length} 
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1}
            <Chip 
              label={`${currentQuestionData.points} points`}
              color="secondary"
              size="small"
              sx={{ ml: 1 }}
            />
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2 }}>
            {currentQuestionData.text}
          </Typography>

          {currentQuestionData.image && (
            <Box sx={{ mb: 2 }}>
              <img 
                src={currentQuestionData.image} 
                alt="Question"
                style={{ maxWidth: '100%', maxHeight: 300 }}
              />
            </Box>
          )}

          {currentQuestionData.type === 'multiple-choice' ? (
            <RadioGroup
              value={answers[currentQuestionData.id] || ''}
              onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
            >
              {currentQuestionData.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={4}
              value={answers[currentQuestionData.id] || ''}
              onChange={(e) => handleAnswer(currentQuestionData.id, e.target.value)}
              placeholder="Enter your answer here..."
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        {currentQuestion === exam.questions.length - 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            Submit Exam
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={() => setCurrentQuestion(prev => prev + 1)}
          >
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default ExamTaking; 