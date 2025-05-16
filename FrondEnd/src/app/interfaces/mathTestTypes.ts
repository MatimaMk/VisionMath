export interface MathQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "open_ended";
  options?: string[];
  correctAnswer: string;
  explanation?: string;
}

export interface ClientMathQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "open_ended";
  options?: string[];
}

export interface MathTest {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questions: MathQuestion[];
  created_at?: string;
}

export interface MathTestDisplay {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface ClientMathTest {
  id: string;
  title: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  questions: ClientMathQuestion[];
  userId: string;
}

export interface GradedQuestion extends MathQuestion {
  userAnswer: string;
  isCorrect: boolean;
}

export interface Recommendation {
  title: string;
  description: string;
}

export interface TestResult {
  id: string;
  test_id: string;
  score: number;
  time_in_seconds: number;
  questions: GradedQuestion[];
  recommendations: Recommendation[];
  completed_at?: string;
  math_tests?: {
    id: string;
    title: string;
    topic: string;
    difficulty: "easy" | "medium" | "hard";
  };
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
}
export enum QuestionType {
  MultipleChoice = "multiple-choice",
  ShortAnswer = "short-answer",
  LongAnswer = "long-answer",
}

// interfaces/mathTestTypes.ts
export interface MathQuestionPDF {
  question: string;
  answer: string;
  solution: string;
}

export interface MathQuestion {
  id: string;
  text: string;
  QuestionType: QuestionType;
  correctAnswer: string;
  explanation?: string;
}

export interface TestHistoryItem {
  id: string;
  test_id: string;
  score: number;
  time_in_seconds: number;
  completed_at?: string;
  math_tests?: {
    id: string;
    title: string;
    topic: string;
    difficulty: "easy" | "medium" | "hard";
  };
}

export type AnswersMap = Record<string, string>;
