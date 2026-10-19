import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header/header';
import { Footer } from '@/components/layout/footer/footer';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Bao Bì Đức Trọng | Giải Pháp Bao Bì Toàn Diện Cho Nông Sản',
  description:
    'Cập nhật kiến thức đóng gói, giải pháp bảo quản nông sản và những hoạt động mới nhất từ Bao Bì Đức Trọng.',
  icons: {
    icon: '/icons/site_icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen flex flex-col font-sans bg-white text-gray-800 antialiased selection:bg-[#0c5c36]/15 selection:text-[#0c5c36]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
