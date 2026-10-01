import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QuizMaster | Advanced Learning",
  description: "Practice your knowledge with quizzes and flashcards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <nav className="navbar">
          <div className="container">
            <a href="/" className="navbar-brand">QuizMaster</a>
            <div className="navbar-nav">
              <a href="/dashboard" className="nav-link" style={{ fontWeight: 600, color: 'var(--accent-color)' }}>🔥 Dashboard</a>
              <a href="/subjects" className="nav-link">Subjects</a>
              <a href="/login" className="btn btn-outline" style={{ padding: '6px 16px' }}>Logout</a>
            </div>
          </div>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
