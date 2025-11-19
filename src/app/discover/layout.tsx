import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Opportunities",
  description: "Discover exclusive job opportunities and rewards using your Proof-of-Work NFTs. Unlock career opportunities in web3 by completing courses and earning certificates on EduLearn.",
  openGraph: {
    title: "Discover Opportunities | EduLearn",
    description: "Discover exclusive job opportunities and rewards using your Proof-of-Work NFTs. Unlock career opportunities in web3 by completing courses and earning certificates on EduLearn.",
    url: "https://edulearn.fun/discover",
  },
  twitter: {
    title: "Discover Opportunities | EduLearn",
    description: "Discover exclusive job opportunities and rewards using your Proof-of-Work NFTs.",
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

