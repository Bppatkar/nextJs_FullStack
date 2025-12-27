import type { Metadata } from 'next';
import { fontsans } from 'next/font/google';
import './globals.css';

import { Toaster } from 'sonner';
import ClientSessionProvider from './providers/ClientSessionProvider';
import { cn } from '@/lib/utils';

const fontSans = fontSans({
  subsets: ['latin'],
  variable: '--font-sans',
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
    <html lang="en">
      <body
        className={cn(
          'min-h-screen  font-sans antialiased bg-slate-50',
          fontSans.variable
        )}
      >
        <ClientSessionProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ClientSessionProvider>
      </body>
    </html>
  );
}
