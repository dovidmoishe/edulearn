import type { Metadata } from "next";
import localFont from 'next/font/local'
import Script from 'next/script'
import "./globals.css";
import UserInitializer from "../components/UserInitializer";
import { Toaster } from "@/components/ui/sonner"
import HMRErrorHandler from "../components/HMRErrorHandler";

const satoshi = localFont({src: '../../public/assets/fonts/Satoshi-Regular.otf', variable: '--font-satoshi'});

export const metadata: Metadata = {
  title: {
    default: "EduLearn - Make Learning Fun",
    template: "%s | EduLearn"
  },
  description: "EduLearn is an incentivized Web3 AI study companion. Learn Web3 smarter, take quizzes, earn XP, and unlock NFT rewards as proof of progress.",
  keywords: [
    "Web3 education",
    "blockchain learning platform",
    "Solana learning app",
    "Web3 study companion",
    "learn to earn",
    "NFT certificates",
    "crypto rewards",
    "personalized learning roadmaps",
    "AI tutor",
    "gamified learning",
    "quiz-based learning",
    "proof of work"
  ],
  authors: [{ name: "EduLearn Team" }],
  creator: "EduLearn",
  publisher: "EduLearn",
  metadataBase: new URL('https://edulearn.fun'),
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://edulearn.fun',
    siteName: 'EduLearn',
    title: 'EduLearn - Make Learning Fun',
    description: 'Learn Web3 smarter with an AI tutor, quizzes, XP, and NFT rewards that prove your progress.',
    images: [
      {
        url: 'https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png',
        width: 1200,
        height: 630,
        alt: 'EduLearn - Web3 AI study companion',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLearn - Make Learning Fun',
    description: 'Learn Web3 smarter. Earn as you go with quizzes, XP, and NFT rewards.',
    images: ['https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png'],
    creator: '@edulearndotfun',
    site: '@edulearndotfun',
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'education',
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "EduLearn",
  "description": "Incentivized Web3 AI study companion with quizzes, XP, and NFT achievement rewards",
  "url": "https://edulearn.fun",
  "logo": "https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png",
  "sameAs": [
    "https://twitter.com/edulearndotfun"
  ],
  "offers": {
    "@type": "Offer",
    "category": "Education"
  },
  "educationalCredentialAwarded": "Certificate",
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Web3 Learning Paths",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Web3 Foundations",
        "description": "Learn blockchain basics, wallets, transactions, and core Web3 concepts"
      },
      {
        "@type": "Course",
        "name": "Solana Development",
        "description": "Build Solana knowledge with guided roadmaps, quizzes, and practical milestones"
      },
      {
        "@type": "Course",
        "name": "DeFi Foundations",
        "description": "Understand decentralized finance through AI tutoring and active recall"
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${satoshi.className} antialiased`}
      >
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <HMRErrorHandler />
        <UserInitializer />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
