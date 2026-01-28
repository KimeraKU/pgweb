import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aggregation Editor',
  description: 'A modern aggregation editor built with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
