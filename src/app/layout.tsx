import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hazmat Class 4 Exam Quiz',
  description: 'Study app for Hazardous Materials Handler Class 4 Exam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body>
        <nav className="navbar navbar-dark bg-danger mb-4">
          <div className="container">
            <span className="navbar-brand mb-0 h1">Hazmat Class 4 Exam Quiz</span>
          </div>
        </nav>
        <div className="container">
          {children}
        </div>
        <footer className="mt-5 py-3 bg-light">
          <div className="container text-center text-muted">
            <small>Hazardous Materials Handler Class 4 Exam Study App</small>
          </div>
        </footer>
      </body>
    </html>
  );
}
