import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diary under the light',
  description: 'AI analysis of your emotions in your diary',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='kr'>
      <body>{children}</body>
    </html>
  );
}
