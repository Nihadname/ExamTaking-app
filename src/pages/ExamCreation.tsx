import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Chip
} from '@mui/material';
import { Delete, Edit, Add, Save, CloudUpload } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Question, Exam } from '../types';
import { setExams } from '../store/slices/examSlice';
import { styled } from '@mui/material/styles';
import { RootState } from '../store/index';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

function ExamCreation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const existingExams = useSelector((state: RootState) => state.exam.exams);
  const [activeStep, setActiveStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: 'multiple-choice',
    options: [''],
    correctAnswer: '',
    points: 1,
    image: undefined as string | undefined
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const steps = ['Exam Details', 'Add Questions', 'Review & Submit'];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
  };

  const removeOption = (index: number) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.filter((_, i) => i !== index)
    });
  };

  const addQuestion = () => {
    if (!currentQuestion.text || (currentQuestion.type === 'multiple-choice' && !currentQuestion.correctAnswer)) {
      return;
    }

    const newQuestion: Question = {
      id: Date.now().toString(),
      text: currentQuestion.text,
      type: currentQuestion.type as 'multiple-choice' | 'text' | 'file-upload',
      image: currentQuestion.image,
      options: currentQuestion.type === 'multiple-choice' ? currentQuestion.options : undefined,
      correctAnswer: currentQuestion.correctAnswer,
      points: currentQuestion.points
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = newQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, newQuestion]);
    }

    setCurrentQuestion({
      text: '',
      type: 'multiple-choice',
      options: [''],
      correctAnswer: '',
      points: 1,
      image: undefined
    });
  };

  const editQuestion = (index: number) => {
    const question = questions[index];
    setCurrentQuestion({
      text: question.text,
      type: question.type,
      options: question.options || [''],
      correctAnswer: question.correctAnswer || '',
      points: question.points || 1,
      image: question.image
    });
    setEditingIndex(index);
  };

  const deleteQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      title,
      description,
      questions,
      createdBy: 'current-user-id',
      duration,
      category: 'General', // Default values for new fields
      tags: [],
      difficulty: 'medium',
      timeLimit: duration * 60,
      passingScore: 60
    };

    dispatch(setExams([...existingExams, newExam]));
    navigate('/');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCurrentQuestion({
          ...currentQuestion,
          image: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const renderQuestionForm = () => (
    <Box sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Question Text"
        value={currentQuestion.text}
        onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
        sx={{ mb: 2 }}
        multiline
        rows={2}
      />

      <Box sx={{ mb: 2 }}>
        <Button
          component="label"
          variant="outlined"
          startIcon={<CloudUpload />}
          sx={{ mt: 2 }}
        >
          Upload Image
          <VisuallyHiddenInput
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </Button>
        {currentQuestion.image && (
          <Box sx={{ mt: 2, position: 'relative' }}>
            <img
              src={currentQuestion.image}
              alt="Question"
              style={{ maxWidth: '100%', maxHeight: 200 }}
            />
            <IconButton
              onClick={() => setCurrentQuestion({ ...currentQuestion, image: undefined })}
              sx={{ position: 'absolute', top: 8, right: 8 }}
              color="error"
            >
              <Delete />
            </IconButton>
          </Box>
        )}
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Question Type</InputLabel>
            <Select
              value={currentQuestion.type}
              label="Question Type"
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, type: e.target.value })}
            >
              <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
              <MenuItem value="text">Text Answer</MenuItem>
              <MenuItem value="file-upload">File Upload</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="number"
            label="Points"
            value={currentQuestion.points}
            onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: Number(e.target.value) })}
            InputProps={{ inputProps: { min: 1 } }}
          />
        </Grid>
      </Grid>

      {currentQuestion.type === 'multiple-choice' && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle1" gutterBottom>Options:</Typography>
          {currentQuestion.options.map((option, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                label={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              <IconButton color="error" onClick={() => removeOption(index)}>
                <Delete />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<Add />}
            onClick={() => setCurrentQuestion({
              ...currentQuestion,
              options: [...currentQuestion.options, '']
            })}
            sx={{ mt: 1 }}
          >
            Add Option
          </Button>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Correct Answer</InputLabel>
            <Select
              value={currentQuestion.correctAnswer}
              label="Correct Answer"
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
            >
              {currentQuestion.options.map((option, index) => (
                <MenuItem key={index} value={option}>{option}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={addQuestion}
        sx={{ mt: 2 }}
        disabled={!currentQuestion.text}
      >
        {editingIndex !== null ? 'Update Question' : 'Add Question'}
      </Button>
    </Box>
  );

  const renderQuestionsList = () => (
    <List>
      {questions.map((question, index) => (
        <React.Fragment key={question.id}>
          <ListItem>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6">Question {index + 1}</Typography>
                  <Box>
                    <Chip label={`${question.points} points`} color="primary" size="small" sx={{ mr: 1 }} />
                    <Chip label={question.type} color="secondary" size="small" />
                  </Box>
                </Box>
                <Typography sx={{ mt: 1 }}>{question.text}</Typography>
                {question.type === 'multiple-choice' && (
                  <Box sx={{ mt: 1 }}>
                    {question.options?.map((option, optIndex) => (
                      <Typography
                        key={optIndex}
                        color={option === question.correctAnswer ? 'success.main' : 'text.primary'}
                      >
                        {optIndex + 1}. {option}
                      </Typography>
                    ))}
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <IconButton onClick={() => editQuestion(index)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => deleteQuestion(index)} color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </ListItem>
          <Divider />
        </React.Fragment>
      ))}
    </List>
  );

  const renderStep = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Exam Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                InputProps={{ inputProps: { min: 1 } }}
                required
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <>
            {renderQuestionForm()}
            {questions.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" gutterBottom>Added Questions:</Typography>
                {renderQuestionsList()}
              </Box>
            )}
          </>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>Exam Summary</Typography>
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h5">{title}</Typography>
                <Typography color="textSecondary">{description}</Typography>
                <Typography sx={{ mt: 1 }}>Duration: {duration} minutes</Typography>
                <Typography>Total Questions: {questions.length}</Typography>
                <Typography>Total Points: {questions.reduce((sum, q) => sum + (q.points || 1), 0)}</Typography>
              </CardContent>
            </Card>
            {renderQuestionsList()}
          </Box>
        );
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Create New Exam</Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {renderStep(activeStep)}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          onClick={() => setActiveStep(prev => prev - 1)}
          disabled={activeStep === 0}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            if (activeStep === steps.length - 1) {
              handleSubmit();
            } else {
              setActiveStep(prev => prev + 1);
            }
          }}
          disabled={
            (activeStep === 0 && (!title || !description || !duration)) ||
            (activeStep === 1 && questions.length === 0)
          }
        >
          {activeStep === steps.length - 1 ? 'Create Exam' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
}

export default ExamCreation; 