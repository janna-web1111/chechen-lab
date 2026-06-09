export type VerificationStatus = "needs_native_review" | "reviewed" | "published";

export type StudyCard = {
  id: string;
  themeId: string;
  order: number;
  ce: string;
  ru: string;
  readingHint: string;
  difficulty: "A0" | "A1";
  verificationStatus: VerificationStatus;
};

export type Theme = {
  id: string;
  level: "A0-A1";
  order: number;
  title: string;
  description: string;
  learningNote?: string;
  status: VerificationStatus;
  cards: StudyCard[];
};

export type QuizOption = {
  id: string;
  cardId: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  cardId: string;
  prompt: string;
  options: QuizOption[];
  correctCardId: string;
  explanation: string;
};
