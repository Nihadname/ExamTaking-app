interface Notification {
  id: string;
  type: 'exam_scheduled' | 'exam_reminder' | 'result_available' | 'feedback';
  message: string;
  timestamp: string;
  read: boolean;
} 