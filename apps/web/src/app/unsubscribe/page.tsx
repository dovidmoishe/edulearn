"use client";

import Link from "next/link";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, MailX, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useUnsubscribeStore from "../../../core/unsubscribeStore";
import type { UnsubscribeStatus } from "../../../types/unsubscribe.types";

const statusCopy: Record<
  UnsubscribeStatus,
  { title: string; description: string; tone: "success" | "neutral" | "error" }
> = {
  active: {
    title: "Unsubscribe from EduLearn emails?",
    description:
      "You will stop receiving product, learning, and reminder emails from EduLearn.",
    tone: "neutral",
  },
  already_unsubscribed: {
    title: "You are already unsubscribed",
    description: "This email address is no longer subscribed to EduLearn emails.",
    tone: "success",
  },
  unsubscribed: {
    title: "You are unsubscribed",
    description: "You will no longer receive EduLearn emails at this address.",
    tone: "success",
  },
  invalid: {
    title: "This unsubscribe link is invalid",
    description:
      "The link may be incomplete or may not have come from an EduLearn email.",
    tone: "error",
  },
  expired: {
    title: "This unsubscribe link expired",
    description: "Open a recent EduLearn email and use the unsubscribe link there.",
    tone: "error",
  },
};

function StatusIcon({
  status,
  isLoading,
}: {
  status: UnsubscribeStatus | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return <Loader2 className="size-6 animate-spin" aria-hidden="true" />;
  }

  if (status === "unsubscribed" || status === "already_unsubscribed") {
    return <CheckCircle2 className="size-6" aria-hidden="true" />;
  }

  return <MailX className="size-6" aria-hidden="true" />;
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const queryToken = searchParams.get("token")?.trim() || "";
  const {
    status,
    isLoading,
    isSubmitting,
    error,
    fetchStatus,
    unsubscribe,
    reset,
  } = useUnsubscribeStore();

  useEffect(() => {
    if (!queryToken) {
      reset();
      return;
    }
    void fetchStatus(queryToken);
  }, [fetchStatus, queryToken, reset]);

  const missingToken = !queryToken;
  const displayStatus: UnsubscribeStatus | null = missingToken
    ? "invalid"
    : status;
  const copy = displayStatus ? statusCopy[displayStatus] : statusCopy.active;
  const canUnsubscribe = displayStatus === "active" && !isLoading;
  const iconTone =
    copy.tone === "success"
      ? "bg-success/15 text-success"
      : copy.tone === "error"
        ? "bg-destructive/10 text-destructive"
        : "bg-muted text-foreground";

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
        <Card className="w-full rounded-lg">
          <CardHeader className="gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-full ${iconTone}`}
            >
              <StatusIcon status={displayStatus} isLoading={isLoading} />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl leading-tight">
                {isLoading ? "Checking your link" : copy.title}
              </CardTitle>
              <CardDescription className="text-base leading-6">
                {isLoading
                  ? "Please wait while we verify this unsubscribe request."
                  : copy.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {error ? (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                {error}
              </div>
            ) : null}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            {canUnsubscribe ? (
              <Button
                type="button"
                className="min-h-10 w-full sm:flex-1"
                onClick={() => {
                  void unsubscribe();
                }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <MailX className="size-4" aria-hidden="true" />
                )}
                Unsubscribe
              </Button>
            ) : error && queryToken ? (
              <Button
                type="button"
                className="min-h-10 w-full sm:flex-1"
                onClick={() => {
                  void fetchStatus(queryToken);
                }}
                disabled={isLoading}
              >
                <RefreshCw className="size-4" aria-hidden="true" />
                Retry
              </Button>
            ) : null}

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
        </Card>
      </div>
    </main>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background px-4 py-10 text-foreground">
          <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md items-center">
            <Card className="w-full rounded-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Checking your link</CardTitle>
                <CardDescription>
                  Please wait while we verify this unsubscribe request.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </main>
      }
    >
      <UnsubscribeContent />
    </Suspense>
  );
}
