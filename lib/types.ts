export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  difficulty: string;
  question: string;
  options: Option[];
  correctOptionId: string;
  explanation?: string;
}

export interface User {
  name: string;
  className: string;
}

export interface AnswerRecord {
  selectedOptionId: string | null;
  correct: boolean;
}

export interface QuizState {
  user: User;
  questions: Question[];
  answers: Record<string, AnswerRecord>;
  currentIndex: number;
  deadline: number; // Epoch ms for current question's expiry
  status: "in-progress" | "completed";
  startedAt: number;
  completedAt?: number;
}
