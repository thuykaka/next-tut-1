import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { TRPCReactProvider } from '@/trpc/client';
import { fontVariables } from '@/lib/font';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

export const metadata: Metadata = {
  title: 'Meet AI',
  description:
    'Meet AI is a platform for creating and managing AI agents for meetings.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={cn(
          'overflow-hidden overscroll-none font-sans antialiased',
          fontVariables
        )}
      >
        <NextTopLoader showSpinner={false} color='var(--primary)' />
        <TRPCReactProvider>
          <NuqsAdapter>
            <Toaster />
            {children}
          </NuqsAdapter>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
