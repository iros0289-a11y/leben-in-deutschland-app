export type AnswerOption = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  number: number;
  sourceNumber: string;
  category: string;
  subcategory: string;
  state: string | null;
  questionText: string;
  image: string | null;
  answers: AnswerOption[];
  correctAnswerId: string | null;
  sourcePage: number;
  isEvaluable: boolean;
  explanation?: string;
  translationTr?: {
    explanation?: string;
  } | null;
};

export type QuizMode = "exam" | "practice" | "errors" | "statistics";

export type QuestionCount = 10 | 20 | 30 | 50 | "all";

export type QuizConfig = {
  mode: QuizMode;
  count: QuestionCount;
  filter: string;
};

export type AnswerResult = {
  questionId: string;
  selectedAnswerId: string | null;
  correctAnswerId: string | null;
  isCorrect: boolean | null;
};

export type ErrorPoolEntry = {
  questionId: string;
  wrongCount: number;
  correctStreak: number;
  lastAnsweredAt: string;
};

export type CategoryStats = {
  answered: number;
  correct: number;
  incorrect: number;
  ungraded: number;
};

export type AppStats = {
  totalAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  ungradedAnswers: number;
  byCategory: Record<string, CategoryStats>;
  wrongQuestionCounts: Record<string, number>;
};
