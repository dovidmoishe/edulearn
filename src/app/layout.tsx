import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import UserInitializer from "../components/UserInitializer";
import { Toaster } from "@/components/ui/sonner"
import HMRErrorHandler from "../components/HMRErrorHandler";

const satoshi = localFont({src: '../../public/assets/fonts/Satoshi-Regular.otf', variable: '--font-satoshi'});

export const metadata: Metadata = {
  title: "EduLearn",
  description: "Incentivized AI study companion that makes web3 learning fun and rewarding.",
  metadataBase: new URL('https://edulearn.fun'), 
  openGraph: {
    title: "EduLearn",
    description: "Incentivized AI study companion that makes web3 learning fun and rewarding.",
    url: 'https://edulearn.fun', 
    siteName: 'EduLearn',
    images: [
      {
        url: 'https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png', // Path to your preview image (1200x630px recommended)
        width: 1200,
        height: 630,
        alt: 'EduLearn Preview',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduLearn',
    description: 'Incentivized AI study companion that makes web3 learning fun and rewarding.',
    images: ['https://lmektyexzejjvisjpzxu.supabase.co/storage/v1/object/public/media/edulearn-preview.png'],
  },
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
        <HMRErrorHandler />
        <UserInitializer />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
