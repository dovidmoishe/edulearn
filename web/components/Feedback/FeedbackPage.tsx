"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  MessageSquareText,
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
import useFeedbackStore from "../../core/feedbackStore";
import type { FeedbackCategory } from "../../types/feedback.types";

const categoryOptions: { value: FeedbackCategory; label: string }[] = [
  { value: "bug", label: "Bug report" },
  { value: "feature", label: "Feature request" },
  { value: "improvement", label: "Improvement" },
  { value: "other", label: "Other" },
];

const MIN_LENGTH = 10;
const MAX_LENGTH = 500;

export default function FeedbackPage() {
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<FeedbackCategory>("improvement");
  const { submittedFeedback, isSubmitting, error, submitFeedback, reset } =
    useFeedbackStore();

  const trimmedContent = content.trim();
  const validationMessage = useMemo(() => {
    if (!trimmedContent) return "Tell us what we should improve.";
    if (trimmedContent.length < MIN_LENGTH) {
      return `Feedback must be at least ${MIN_LENGTH} characters.`;
    }
    if (trimmedContent.length > MAX_LENGTH) {
      return `Feedback must be ${MAX_LENGTH} characters or fewer.`;
    }
    return null;
  }, [trimmedContent]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (validationMessage || isSubmitting) return;

    void submitFeedback({
      content: trimmedContent,
      category,
    });
  };

  const handleReset = () => {
    setContent("");
    setCategory("improvement");
    reset();
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#F7FAF7] px-4 py-3 text-[#101511] transition-colors duration-300 dark:bg-black dark:text-white sm:px-6 md:px-[86px] md:py-5">
      <NavBar />

      <section className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl items-center py-10">
        <Card className="w-full rounded-lg border-[#D7E7D7] bg-white/90 shadow-lg shadow-emerald-950/5 dark:border-[#2E3033] dark:bg-[#131313] dark:shadow-black/30">
          <CardHeader className="gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-[#00FF80]/15 text-[#008A4E] dark:text-[#00FF80]">
              {submittedFeedback ? (
                <CheckCircle2 className="size-6" aria-hidden="true" />
              ) : (
                <MessageSquareText className="size-6" aria-hidden="true" />
              )}
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl leading-tight">
                {submittedFeedback ? "Feedback received" : "Share feedback"}
              </CardTitle>
              <CardDescription className="text-base leading-6">
                {submittedFeedback
                  ? "Thanks for helping us improve EduLearn."
                  : "Report a bug, request a feature, or tell us what would make EduLearn better."}
              </CardDescription>
            </div>
          </CardHeader>

          {submittedFeedback ? (
            <>
              <CardContent>
                <div className="rounded-md border border-[#00FF80]/30 bg-[#00FF80]/10 p-4 text-sm text-[#0B5F39] dark:text-[#B8FFD9]">
                  Your feedback was submitted and is pending review.
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  className="min-h-10 w-full sm:flex-1"
                  onClick={handleReset}
                >
                  Send another
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-10 w-full sm:flex-1"
                >
                  <Link href="/">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to EduLearn
                  </Link>
                </Button>
              </CardFooter>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="feedback-category">Category</Label>
                  <select
                    id="feedback-category"
                    value={category}
                    onChange={(event) =>
                      setCategory(event.target.value as FeedbackCategory)
                    }
                    className="min-h-11 w-full rounded-md border border-[#D7E7D7] bg-white px-3 text-sm text-[#101511] outline-none transition-colors focus:border-[#00B866] focus:ring-2 focus:ring-[#00FF80]/20 dark:border-[#2E3033] dark:bg-black dark:text-white"
                  >
                    {categoryOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label htmlFor="feedback-content">Message</Label>
                    <span className="text-xs text-muted-foreground">
                      {trimmedContent.length}/{MAX_LENGTH}
                    </span>
                  </div>
                  <textarea
                    id="feedback-content"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    maxLength={MAX_LENGTH + 50}
                    rows={7}
                    placeholder="What should we fix, build, or improve?"
                    className="w-full resize-none rounded-md border border-[#D7E7D7] bg-white px-3 py-3 text-sm leading-6 text-[#101511] outline-none transition-colors placeholder:text-[#7B8A84] focus:border-[#00B866] focus:ring-2 focus:ring-[#00FF80]/20 dark:border-[#2E3033] dark:bg-black dark:text-white dark:placeholder:text-[#777]"
                  />
                  {validationMessage ? (
                    <p className="text-sm text-[#9A4A00] dark:text-[#FFB86B]">
                      {validationMessage}
                    </p>
                  ) : null}
                </div>

                {error ? (
                  <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                    {error}
                  </div>
                ) : null}
              </CardContent>

              <CardFooter className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="submit"
                  className="min-h-10 w-full bg-[#00FF80] text-black hover:bg-[#00E673] sm:flex-1"
                  disabled={Boolean(validationMessage) || isSubmitting}
                >
                  {isSubmitting ? (
                    <Loader2
                      className="size-4 animate-spin"
                      aria-hidden="true"
                    />
                  ) : error ? (
                    <RefreshCw className="size-4" aria-hidden="true" />
                  ) : (
                    <MessageSquareText className="size-4" aria-hidden="true" />
                  )}
                  {error ? "Retry" : "Submit feedback"}
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="min-h-10 w-full sm:flex-1"
                >
                  <Link href="/">
                    <ArrowLeft className="size-4" aria-hidden="true" />
                    Back to EduLearn
                  </Link>
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </section>
      <Footer />
    </main>
  );
}
