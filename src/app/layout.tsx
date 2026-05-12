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
    default: "EduLearn - AI Study Companion for Real-World Skills",
    template: "%s | EduLearn"
  },
  description: "EduLearn is an AI-powered study companion for real-world skill acquisition. Build personalized learning agents, stay accountable, and turn progress into verifiable proof-of-work.",
  keywords: [
    "AI learning platform",
    "study companion",
    "skill acquisition",
    "personalized learning",
    "accountability app",
    "learning roadmap",
    "active recall",
    "quiz and flashcards",
    "career skills",
    "proof of work",
    "verifiable achievements",
    "AI tutor",
    "gamified learning",
    "learning analytics",
    "outcome driven learning"
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
    title: 'EduLearn - AI Study Companion for Real-World Skills',
    description: 'Build personalized AI learning agents, stay consistent with accountability systems, and showcase verifiable proof-of-work.',
    images: [
      {
        url: 'https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png',
        width: 1200,
        height: 630,
        alt: 'EduLearn - AI-powered skill acquisition platform',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLearn - AI Study Companion for Real-World Skills',
    description: 'Most AI tools answer questions. EduLearn helps users stay consistent long enough to become truly skilled.',
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
  "description": "AI-powered study companion for personalized, outcome-driven, and verifiable skill acquisition",
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
    "name": "Real-World Skill Paths",
    "itemListElement": [
      {
        "@type": "Course",
        "name": "Software Engineering",
        "description": "Build practical coding skills with guided projects and active recall"
      },
      {
        "@type": "Course",
        "name": "Product Design",
        "description": "Learn design fundamentals and portfolio-focused execution"
      },
      {
        "@type": "Course",
        "name": "AI and Data Skills",
        "description": "Develop AI literacy and applied workflows for modern teams"
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
