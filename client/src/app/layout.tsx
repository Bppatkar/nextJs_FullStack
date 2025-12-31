import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import ClientSessionProvider from './providers/ClientSessionProvider';
import { cn } from '@/lib/utils';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Vote App',
  description: 'Get your audience',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen font-sans antialiased bg-slate-50',
          geistMono.variable,
          geistSans.variable
        )}
        suppressHydrationWarning
      >
        <ClientSessionProvider>
          <main className="container mx-auto p-4">{children}</main>
          <Toaster richColors position="top-right" />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
