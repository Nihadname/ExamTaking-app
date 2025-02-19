import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamSubmission } from '../../types';

interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  loading: boolean;
  submissions: ExamSubmission[];
}

// Load initial state from localStorage
const loadState = () => {
  try {
    const examsState = localStorage.getItem('exams');
    const submissionsState = localStorage.getItem('submissions');
    return {
      exams: examsState ? JSON.parse(examsState) : [],
      currentExam: null,
      loading: false,
      submissions: submissionsState ? JSON.parse(submissionsState) : [],
    };
  } catch (err) {
    console.error('Error loading exam state:', err);
    return {
      exams: [],
      currentExam: null,
      loading: false,
      submissions: [],
    };
  }
};

const initialState: ExamState = loadState();

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    setExams: (state, action: PayloadAction<Exam[]>) => {
      state.exams = action.payload;
      localStorage.setItem('exams', JSON.stringify(action.payload));
    },
    setCurrentExam: (state, action: PayloadAction<Exam>) => {
      state.currentExam = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addSubmission: (state, action: PayloadAction<ExamSubmission>) => {
      state.submissions.push(action.payload);
      localStorage.setItem('submissions', JSON.stringify(state.submissions));
    },
  },
});

export const { setExams, setCurrentExam, setLoading, addSubmission } = examSlice.actions;
export default examSlice.reducer; 