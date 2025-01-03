// ルートレイアウト
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import Layout from './components/Layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '学内通貨アプリ',
  description: '学内で利用できる通貨アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}