import type { Metadata } from "next";
import FeedbackPage from "../../../components/Feedback/FeedbackPage";

export const metadata: Metadata = {
  title: "Feedback",
  description: "Share feedback with the EduLearn team.",
  alternates: {
    canonical: "/feedback",
  },
};

export default function Page() {
  return <FeedbackPage />;
}
