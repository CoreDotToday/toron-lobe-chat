import { ClerkProvider } from '@clerk/nextjs';
import { Viewport } from 'next';
import { PropsWithChildren } from 'react';

import Analytics from '@/components/Analytics';

import StyleRegistry from './StyleRegistry';

const RootLayout = ({ children }: PropsWithChildren) => {
  // get default theme config to use with ssr
  return (
    <html lang={'ko-kr'} suppressHydrationWarning>
      <body>
        <ClerkProvider>
          <StyleRegistry>{children}</StyleRegistry>
        </ClerkProvider>
        <Analytics />
      </body>
    </html>
  );
};

export default RootLayout;

export { default as metadata } from './metadata';

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  themeColor: [
    { color: '#f8f8f8', media: '(prefers-color-scheme: light)' },
    { color: '#000', media: '(prefers-color-scheme: dark)' },
  ],
  userScalable: false,
  viewportFit: 'cover',
  width: 'device-width',
};
