export type FeedbackCategory = "bug" | "feature" | "improvement" | "other";

export interface CreateFeedbackRequest {
  content: string;
  category?: FeedbackCategory;
  userId?: string;
}

export interface FeedbackResponse {
  id: string;
  userId: string | null;
  content: string;
  category: FeedbackCategory | null;
  status: "pending" | "reviewed" | "resolved";
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
}

export interface FeedbackFormState {
  content: string;
  category: FeedbackCategory;
}
