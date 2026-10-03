export type IsoDateString = string;

export type ActivityType = "quiz" | "chat" | "streak";

export type XpActivity = {
  id: string;
  userId: string;
  type: ActivityType;
  title: string;
  xpEarned: number;
  createdAt: IsoDateString;
};

export type ActivityPagination = {
  page: number;
  limit: number;
  count: number;
  total: number;
  totalPages: number;
  hasExactTotal: boolean;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type ActivityListResponse =
  | XpActivity[]
  | {
      data?: XpActivity[];
      activities?: XpActivity[];
      pagination?: ActivityPagination;
    };

export type CreateActivityRequest = {
  userId: string;
  type: ActivityType;
  title: string;
  xpEarned: number;
};

export type SubmitQuizRequest = {
  userId: string;
  chatId?: string;
  title: string;
  answers: Array<{
    question: string;
    selectedAnswer: string;
    correctAnswer: string;
  }>;
};

export type QuizXpTotalResponse = {
  userId?: string;
  type?: "quiz";
  total?: number;
  totalXp?: number;
};
