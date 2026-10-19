import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Choose the EduLearn plan that fits your learning goals. Start free or unlock advanced AI models, higher limits, and premium learning features.",
  openGraph: {
    title: "Pricing Plans | EduLearn",
    description: "Choose the EduLearn plan that fits your learning goals with free and premium options.",
    url: "https://edulearn.fun/pricing",
  },
  twitter: {
    title: "Pricing Plans | EduLearn",
    description: "Choose the EduLearn plan that fits your learning goals.",
  },
  alternates: {
    canonical: '/pricing',
  },
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

