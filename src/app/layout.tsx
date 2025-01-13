import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

export const metadata: Metadata = {
  title: 'Diary under the light',
  description: 'AI analysis of your emotions in your diary',
};

const pretendard = localFont({
  src: '../../static/font/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='kr'
      className={`${pretendard.variable}`}
    >
      <body className={pretendard.className}>{children}</body>
    </html>
  );
}
