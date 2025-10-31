import '@picocss/pico/css/pico.min.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '危険物乙４試験対策クイズ',
  description: '危険物取扱者乙種第4類試験の学習用アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" data-theme="light">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <nav className="app-nav">
          <div className="container">
            <h1>危険物乙４試験対策クイズ</h1>
          </div>
        </nav>
        <main className="container">
          {children}
        </main>
        <footer>
          <div className="container">
            <small>危険物取扱者乙種第4類試験 学習用アプリ</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
