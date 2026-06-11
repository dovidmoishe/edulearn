"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  Loader2,
  RefreshCw,
} from "lucide-react";
import NavBar from "../Home/NavBar/NavBar";
import Footer from "../Home/Footer/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import useSurveyStore from "../../core/surveyStore";
import type {
  PublicSurvey,
  SurveyAnswerValue,
  SurveyQuestion,
} from "../../types/survey.types";

interface SurveyPageProps {
  slug?: string;
}

export default function SurveyPage({ slug }: SurveyPageProps) {
  const {
    activeSurvey,
    surveysBySlug,
    submittedResponse,
    isLoading,
    isSubmitting,
    error,
    loadActiveSurvey,
    loadSurveyBySlug,
    submitSurveyResponse,
    resetSubmission,
  } = useSurveyStore();
  const [answers, setAnswers] = useState<Record<string, SurveyAnswerValue>>({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  useEffect(() => {
    resetSubmission();
    setAnswers({});
    setAttemptedSubmit(false);
    if (slug) {
      void loadSurveyBySlug(slug);
    } else {
      void loadActiveSurvey();
    }
  }, [loadActiveSurvey, loadSurveyBySlug, resetSubmission, slug]);

  const survey = slug ? surveysBySlug[slug] : activeSurvey;
  const missingRequired = useMemo(
    () =>
      survey?.questions.filter(
        (question) => question.required && isEmptyAnswer(answers[question.id]),
      ) ?? [],
    [answers, survey?.questions],
  );

  const updateAnswer = (questionId: string, value: SurveyAnswerValue) => {
    setAnswers((current) => ({ ...current, [questionId]: value }));
  };

  const toggleMultipleChoice = (question: SurveyQuestion, option: string) => {
    const currentValue = answers[question.id];
    const current = Array.isArray(currentValue) ? currentValue : [];
    updateAnswer(
      question.id,
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);
    if (!survey || missingRequired.length || isSubmitting) return;

    void submitSurveyResponse(
      survey.id,
      survey.questions.map((question) => ({
        questionId: question.id,
        value: answers[question.id] ?? null,
      })),
    );
  };

  const handleReset = () => {
    setAnswers({});
    setAttemptedSubmit(false);
    resetSubmission();
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7FAF7] px-4 py-3 text-[#101511] transition-colors duration-300 dark:bg-black dark:text-white sm:px-6 md:px-[86px] md:py-5">
      <NavBar />
      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl items-center py-10">
        <Card className="w-full rounded-lg border-[#D7E7D7] bg-white/90 shadow-lg shadow-emerald-950/5 dark:border-[#2E3033] dark:bg-[#131313] dark:shadow-black/30">
          {renderContent({
            survey,
            submitted: Boolean(submittedResponse),
            isLoading,
            isSubmitting,
            error,
            answers,
            attemptedSubmit,
            missingRequired,
            updateAnswer,
            toggleMultipleChoice,
            handleSubmit,
            handleReset,
          })}
        </Card>
      </section>
      <Footer />
    </main>
  );
}

function renderContent(params: {
  survey: PublicSurvey | null;
  submitted: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  answers: Record<string, SurveyAnswerValue>;
  attemptedSubmit: boolean;
  missingRequired: SurveyQuestion[];
  updateAnswer: (questionId: string, value: SurveyAnswerValue) => void;
  toggleMultipleChoice: (question: SurveyQuestion, option: string) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}) {
  if (params.isLoading) {
    return (
      <CardContent className="flex min-h-80 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#00B866]" />
      </CardContent>
    );
  }

  if (!params.survey) {
    return (
      <>
        <CardHeader className="gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF80]/15 text-[#008A4E] dark:text-[#00FF80]">
            <ClipboardList className="size-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl leading-tight">
              Survey unavailable
            </CardTitle>
            <CardDescription className="text-base leading-6">
              This survey is not published or no active survey is available.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter>
          <Button asChild variant="outline" className="min-h-10 w-full">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to EduLearn
            </Link>
          </Button>
        </CardFooter>
      </>
    );
  }

  if (params.submitted) {
    return (
      <>
        <CardHeader className="gap-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF80]/15 text-[#008A4E] dark:text-[#00FF80]">
            <CheckCircle2 className="size-6" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl leading-tight">
              Response received
            </CardTitle>
            <CardDescription className="text-base leading-6">
              Thanks for helping us improve EduLearn.
            </CardDescription>
          </div>
        </CardHeader>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="min-h-10 w-full sm:flex-1"
            onClick={params.handleReset}
          >
            Submit another
          </Button>
          <Button asChild variant="outline" className="min-h-10 w-full sm:flex-1">
            <Link href="/">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Back to EduLearn
            </Link>
          </Button>
        </CardFooter>
      </>
    );
  }

  return (
    <form onSubmit={params.handleSubmit}>
      <CardHeader className="gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF80]/15 text-[#008A4E] dark:text-[#00FF80]">
          <ClipboardList className="size-6" aria-hidden="true" />
        </div>
        <div className="space-y-2">
          <CardTitle className="text-3xl leading-tight">
            {params.survey.title}
          </CardTitle>
          {params.survey.description ? (
            <CardDescription className="text-base leading-6">
              {params.survey.description}
            </CardDescription>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {params.survey.questions.map((question, index) => (
          <QuestionField
            key={question.id}
            index={index}
            question={question}
            value={params.answers[question.id] ?? null}
            showRequiredError={
              params.attemptedSubmit &&
              params.missingRequired.some((item) => item.id === question.id)
            }
            updateAnswer={params.updateAnswer}
            toggleMultipleChoice={params.toggleMultipleChoice}
          />
        ))}

        {params.error ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {params.error}
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          className="min-h-10 w-full bg-[#00FF80] text-black hover:bg-[#00E673] sm:flex-1"
          disabled={params.isSubmitting}
        >
          {params.isSubmitting ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : params.error ? (
            <RefreshCw className="size-4" aria-hidden="true" />
          ) : (
            <ClipboardList className="size-4" aria-hidden="true" />
          )}
          {params.error ? "Retry" : "Submit survey"}
        </Button>
        <Button asChild variant="outline" className="min-h-10 w-full sm:flex-1">
          <Link href="/">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to EduLearn
          </Link>
        </Button>
      </CardFooter>
    </form>
  );
}

function QuestionField({
  index,
  question,
  value,
  showRequiredError,
  updateAnswer,
  toggleMultipleChoice,
}: {
  index: number;
  question: SurveyQuestion;
  value: SurveyAnswerValue;
  showRequiredError: boolean;
  updateAnswer: (questionId: string, value: SurveyAnswerValue) => void;
  toggleMultipleChoice: (question: SurveyQuestion, option: string) => void;
}) {
  return (
    <fieldset className="space-y-3 rounded-md border border-[#D7E7D7] p-4 dark:border-[#2E3033]">
      <Label className="block text-base leading-6">
        {index + 1}. {question.prompt}
        {question.required ? <span className="text-[#B00020]"> *</span> : null}
      </Label>
      {renderQuestionInput(question, value, updateAnswer, toggleMultipleChoice)}
      {showRequiredError ? (
        <p className="text-sm text-[#9A4A00] dark:text-[#FFB86B]">
          This question is required.
        </p>
      ) : null}
    </fieldset>
  );
}

function renderQuestionInput(
  question: SurveyQuestion,
  value: SurveyAnswerValue,
  updateAnswer: (questionId: string, value: SurveyAnswerValue) => void,
  toggleMultipleChoice: (question: SurveyQuestion, option: string) => void,
) {
  const inputClass =
    "w-full rounded-md border border-[#D7E7D7] bg-white px-3 py-3 text-sm leading-6 text-[#101511] outline-none transition-colors placeholder:text-[#7B8A84] focus:border-[#00B866] focus:ring-2 focus:ring-[#00FF80]/20 dark:border-[#2E3033] dark:bg-black dark:text-white dark:placeholder:text-[#777]";

  switch (question.type) {
    case "short_text":
      return (
        <input
          value={typeof value === "string" ? value : ""}
          onChange={(event) => updateAnswer(question.id, event.target.value)}
          className={inputClass}
        />
      );
    case "long_text":
      return (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(event) => updateAnswer(question.id, event.target.value)}
          rows={5}
          className={`${inputClass} resize-none`}
        />
      );
    case "rating":
      return (
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => updateAnswer(question.id, rating)}
              className={`size-11 rounded-md border text-sm font-semibold transition-colors ${
                value === rating
                  ? "border-[#00B866] bg-[#00FF80] text-black"
                  : "border-[#D7E7D7] bg-white dark:border-[#2E3033] dark:bg-black"
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
      );
    case "single_choice":
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm">
              <input
                type="radio"
                name={question.id}
                checked={value === option}
                onChange={() => updateAnswer(question.id, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "multiple_choice":
      return (
        <div className="space-y-2">
          {question.options.map((option) => (
            <label key={option} className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={Array.isArray(value) && value.includes(option)}
                onChange={() => toggleMultipleChoice(question, option)}
              />
              {option}
            </label>
          ))}
        </div>
      );
    case "boolean":
      return (
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={question.id}
              checked={value === true}
              onChange={() => updateAnswer(question.id, true)}
            />
            Yes
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name={question.id}
              checked={value === false}
              onChange={() => updateAnswer(question.id, false)}
            />
            No
          </label>
        </div>
      );
  }
}

function isEmptyAnswer(value: SurveyAnswerValue | undefined) {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "string" && value.trim().length === 0) ||
    (Array.isArray(value) && value.length === 0)
  );
}
