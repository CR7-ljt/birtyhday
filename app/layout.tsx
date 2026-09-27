import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HAPPY 18TH · A NEW CHAPTER',
  description: 'A celebration for a new chapter at eighteen.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="zh-CN"><body>{children}</body></html>;
}
