import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on skill-building, study systems, active recall, and getting better outcomes with EduLearn.",
  openGraph: {
    title: "Blog | EduLearn",
    description:
      "Articles on skill-building, study systems, active recall, and getting better outcomes with EduLearn.",
    url: "https://edulearn.fun/blog",
  },
  twitter: {
    title: "Blog | EduLearn",
    description:
      "Articles on skill-building, study systems, active recall, and getting better outcomes with EduLearn.",
  },
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
