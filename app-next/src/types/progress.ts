export type QuizResult = {
  score: number;
  completedAt: string;
};

export type UserProgress = {
  completedThemes: string[];
  studiedCards: string[];
  quizResults: Record<string, QuizResult>;
  firstVisitAt: string;
  lastVisitAt: string;
};
