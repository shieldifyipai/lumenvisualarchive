import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'LUMEN ARCHIVE • Contemporary Fine Art & Editorial Photography',
  description: 'An independent visual archive showcasing contemporary architectural, documentary, and landscape photography with cinematic depth and gallery aesthetics.',
  keywords: ['photography portfolio', 'fine art photography', 'visual archive', 'editorial series', 'contemporary photography', 'gallery archive'],
  openGraph: {
    title: 'LUMEN ARCHIVE • Contemporary Photography Portfolio',
    description: 'An independent visual archive showcasing curated contemporary photography series with cinematic depth.',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: '48x48' },
    ],
    shortcut: '/favicon.svg',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-amber-500/20 selection:text-amber-200`}
      >
        {children}
      </body>
    </html>
  );
}
