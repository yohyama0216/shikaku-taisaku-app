import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '資格試験対策クイズ',
  description: '宅建・簿記初級試験の学習用アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <nav className="navbar navbar-dark bg-primary mb-4">
          <div className="container">
            <Link href="/" className="navbar-brand mb-0 h1 text-white text-decoration-none">
              資格試験対策クイズ
            </Link>
            <div className="navbar-nav">
              <Link href="/syllabus" className="nav-link text-white">
                試験範囲
              </Link>
            </div>
          </div>
        </nav>
        <div className="container">
          {children}
        </div>
        <footer className="mt-5 py-3 bg-light">
          <div className="container text-center text-muted">
            <small>資格試験 学習用アプリ</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
