export interface User {
  id: string;
  name: string;
  email: string;
  role: 'teacher' | 'student';
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdBy: string;
  duration: number; // in minutes
  category: string;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number;
  passingScore: number;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'text' | 'file-upload';
  image?: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  explanation?: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  userId: string;
  answers: {
    questionId: string;
    answer: string;
  }[];
  score: number;
  timeSpent: number;
  submittedAt: string;
} 