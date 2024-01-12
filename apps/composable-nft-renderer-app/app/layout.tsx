import { Providers } from 'components/app/providers';
import type { Metadata } from 'next';
import React from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nextjs RMRK Composable NFT Renderer example',
  description: 'Renderer a RMRK NFTs on any supported chain',
};

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
