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

export interface RootState {
  auth: ReturnType<typeof authReducer>;
  exam: ExamState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    exam: examReducer,
  },
});

export type AppDispatch = typeof store.dispatch; 