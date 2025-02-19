import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import examReducer from './slices/examSlice';
import { Exam, ExamSubmission } from '../types';

export interface ExamState {
  exams: Exam[];
  currentExam: Exam | null;
  loading: boolean;
  submissions: ExamSubmission[];
}

// Define RootState only once
export type RootState = {
  auth: ReturnType<typeof authReducer>;
  exam: ExamState;
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
  },
});

export default store;

export type AppDispatch = typeof store.dispatch; 