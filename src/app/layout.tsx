import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Image to Text Extractor',
  description: 'Extract text from images using advanced AI-powered OCR technology. Upload images in JPEG, PNG, WebP, or GIF format and get accurate text extraction results.',
  keywords: ['OCR', 'image to text', 'text extraction', 'AI', 'image processing', 'document scanner'],
  authors: [{ name: 'Image to Text App' }],
  creator: 'Image to Text App',
  publisher: 'Image to Text App',
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Image to Text Extractor - AI-Powered OCR',
    description: 'Extract text from images using advanced AI technology. Fast, accurate, and easy to use.',
    siteName: 'Image to Text Extractor',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image to Text Extractor',
    description: 'Extract text from images using AI-powered OCR technology.',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={`${inter.className} antialiased min-h-screen bg-background`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}