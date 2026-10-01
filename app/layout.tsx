import './globals.css';
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { WhatsAppButton } from '@/components/layout/whatsapp-button';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans-body',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aaravmehtaportraits.com'),
  title: {
    default: 'Aarav Mehta — Portrait Artist | Pencil & Charcoal Portraits',
    template: '%s — Aarav Mehta Portraits',
  },
  description:
    'Commission handcrafted pencil and charcoal portraits from a dedicated portrait artist. Turning your most meaningful photographs into timeless art.',
  keywords: [
    'pencil portrait artist',
    'charcoal portrait artist',
    'realistic portrait drawing',
    'custom portrait artist',
    'hand-drawn portraits',
    'pencil sketch portrait',
    'family portrait artist',
    'pet portrait artist',
    'portrait artist India',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    title: 'Aarav Mehta — Portrait Artist | Pencil & Charcoal Portraits',
    description:
      'Commission handcrafted pencil and charcoal portraits from a dedicated portrait artist in India.',
    siteName: 'Aarav Mehta Portraits',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aarav Mehta — Portrait Artist',
    description: 'Handcrafted pencil & charcoal portraits. Commission your own.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
