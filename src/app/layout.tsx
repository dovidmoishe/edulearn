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
    default: "EduLearn - AI-Powered Web3 Learning Companion",
    template: "%s | EduLearn"
  },
  description: "EduLearn is an incentivized AI study companion that makes web3 learning fun and rewarding. Learn blockchain, DeFi, NFTs, and crypto while earning rewards. Interactive quizzes, AI chat tutor, and gamified learning experience.",
  keywords: [
    "web3 learning",
    "blockchain education",
    "crypto learning",
    "DeFi education",
    "NFT learning",
    "AI tutor",
    "gamified learning",
    "crypto rewards",
    "blockchain courses",
    "web3 courses",
    "cryptocurrency education",
    "AI study companion",
    "learn crypto",
    "learn blockchain",
    "web3 training"
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
    title: 'EduLearn - AI-Powered Web3 Learning Companion',
    description: 'Incentivized AI study companion that makes web3 learning fun and rewarding. Learn blockchain, DeFi, NFTs, and crypto while earning rewards.',
    images: [
      {
        url: 'https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png',
        width: 1200,
        height: 630,
        alt: 'EduLearn - AI-Powered Web3 Learning Platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLearn - AI-Powered Web3 Learning Companion',
    description: 'Incentivized AI study companion that makes web3 learning fun and rewarding. Learn blockchain, DeFi, NFTs, and crypto while earning rewards.',
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
  "description": "Incentivized AI study companion that makes web3 learning fun and rewarding",
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
    "name": "Web3 Learning Courses",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Blockchain Fundamentals",
        "description": "Learn the basics of blockchain technology"
      },
      {
        "@type": "Course",
        "name": "DeFi Education",
        "description": "Master decentralized finance concepts"
      },
      {
        "@type": "Course",
        "name": "NFT Learning",
        "description": "Understand NFTs and their applications"
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
