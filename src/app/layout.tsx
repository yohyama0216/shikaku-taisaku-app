import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '宅建試験対策クイズ',
  description: '宅地建物取引士試験の学習用アプリ',
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
            <span className="navbar-brand mb-0 h1">宅建試験対策クイズ</span>
          </div>
        </nav>
        <div className="container">
          {children}
        </div>
        <footer className="mt-5 py-3 bg-light">
          <div className="container text-center text-muted">
            <small>宅地建物取引士試験 学習用アプリ</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
