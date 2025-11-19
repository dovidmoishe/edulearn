import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing Plans",
  description: "Choose the perfect EduLearn plan for your web3 learning journey. Free plan with basic features or Premium plan with advanced AI models, unlimited chat messages, and exclusive badges. Upgrade your learning experience today.",
  openGraph: {
    title: "Pricing Plans | EduLearn",
    description: "Choose the perfect EduLearn plan for your web3 learning journey. Free plan with basic features or Premium plan with advanced AI models and unlimited chat messages.",
    url: "https://edulearn.fun/pricing",
  },
  twitter: {
    title: "Pricing Plans | EduLearn",
    description: "Choose the perfect EduLearn plan for your web3 learning journey.",
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

