import React from 'react';
import type { Metadata } from 'next';
import '@krishisetu/design-tokens/css';

export const metadata: Metadata = {
  title: 'KrishiSetu | कृषीसेतू | कृषिसेतु | ಕೃಷಿಸೇತು',
  description: 'Agricultural Digital Public Infrastructure Prototype for Unified Scheme & Credit Access',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
