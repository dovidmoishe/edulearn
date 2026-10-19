export type SurveyQuestionType =
  | "short_text"
  | "long_text"
  | "rating"
  | "single_choice"
  | "multiple_choice"
  | "boolean";

export interface SurveyQuestion {
  id: string;
  prompt: string;
  type: SurveyQuestionType;
  options: string[];
  required: boolean;
  sortOrder: number;
}

export interface PublicSurvey {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  questions: SurveyQuestion[];
}

export type SurveyAnswerValue = string | number | boolean | string[] | null;

export interface SubmitSurveyAnswer {
  questionId: string;
  value: SurveyAnswerValue;
}

export interface SubmitSurveyResponseRequest {
  answers: SubmitSurveyAnswer[];
}

export interface SubmitSurveyResponseResult {
  id: string;
  surveyId: string;
  userId: string | null;
  submittedAt: string;
}
