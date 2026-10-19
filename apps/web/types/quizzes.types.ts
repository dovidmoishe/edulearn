/** ISO 8601 from JSON, e.g. "2026-04-20T12:00:00.000Z" */
export type IsoDateString = string;

export type UuidString = string;

export type LegacyQuiz = {
  id: UuidString;
  title: string;
  description: string;
  createdAt: IsoDateString;
};

export type PublicQuizQuestion = {
  question: string;
  options: [string, string, string, string];
  correctAnswer: string;
  explanation: string;
};

export type PublishPublicQuizRequest = {
  title: string;
  description?: string;
  summary?: string;
  coveredConcepts?: string[];
  challengeProfile?: string;
  questions: PublicQuizQuestion[];
  sourceChatId?: UuidString;
};

export type PublishPublicQuizResponse = {
  id: UuidString;
  title: string;
  description: string | null;
  summary: string | null;
  coveredConcepts: string[];
  challengeProfile: string | null;
  createdBy: UuidString;
  createdAt: IsoDateString;
  viewCount: number;
  attemptCount: number;
};

export type PublicQuizListSort = "recent" | "popular";

export type PublicQuizListItem = {
  id: UuidString;
  title: string;
  description: string | null;
  summary: string | null;
  coveredConcepts: string[];
  challengeProfile: string | null;
  createdBy: UuidString;
  viewCount: number;
  attemptCount: number;
  createdAt: IsoDateString;
  creatorUsername: string | null;
};

export type ListPublicQuizzesResponse = PublicQuizListItem[];

export type ListMyPublicQuizzesResponse = PublicQuizListItem[];

export type PublicQuizDetail = {
  id: UuidString;
  title: string;
  description: string | null;
  summary: string | null;
  coveredConcepts: string[];
  challengeProfile: string | null;
  questions: PublicQuizQuestion[];
  createdBy: UuidString;
  sourceChatId: UuidString | null;
  createdAt: IsoDateString;
  viewCount: number;
  attemptCount: number;
};

export type StartPublicQuizParticipationResponse = {
  participationId: UuidString;
  quizId: UuidString;
  joinedAt: IsoDateString;
};

export type SubmitPublicQuizAnswer = {
  questionIndex: number;
  selectedAnswer: string;
};

export type SubmitPublicQuizRequest = {
  userId: UuidString;
  answers: SubmitPublicQuizAnswer[];
  participationId?: UuidString;
};

export type PublicQuizAttemptResultRow = {
  questionIndex: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
};

export type XpActivity = {
  id: UuidString;
  userId: UuidString;
  type: "quiz" | "chat" | "streak";
  title: string | null;
  xpEarned: number;
  createdAt: IsoDateString;
};

export type SubmitPublicQuizResponse = {
  score: number;
  totalQuestions: number;
  results: PublicQuizAttemptResultRow[];
  xpEarned: number;
  activity: XpActivity;
};

export type ListQuizzesQuery = {
  limit?: number;
  offset?: number;
  sort?: PublicQuizListSort;
};
