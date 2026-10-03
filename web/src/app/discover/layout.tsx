import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Opportunities",
  description: "Discover skill-based opportunities unlocked through verifiable proof-of-work achievements on EduLearn.",
  openGraph: {
    title: "Discover Opportunities | EduLearn",
    description: "Discover skill-based opportunities unlocked through verifiable proof-of-work achievements on EduLearn.",
    url: "https://edulearn.fun/discover",
  },
  twitter: {
    title: "Discover Opportunities | EduLearn",
    description: "Discover opportunities unlocked through verifiable proof-of-work.",
  },
  alternates: {
    canonical: '/discover',
  },
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

