import Link from "next/link";

export default function Home() {
  return (
    <div className="container">
      <div style={{ textAlign: 'center', margin: '40px 0', padding: '60px 20px', background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.9))', borderRadius: '24px', border: '1px solid var(--border-color)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px', background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Master Any Topic with QuizMaster
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 40px auto' }}>
          Enhance your learning with interactive quizzes and spaced-repetition flashcards. Track your progress and achieve your goals faster.
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link href="/subjects" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            Start Learning
          </Link>
          <Link href="/login" className="btn btn-outline" style={{ padding: '15px 30px', fontSize: '1.1rem' }}>
            Admin Login
          </Link>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Features</h2>
      <div className="grid">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📚</div>
          <h3>Topic Quizzes</h3>
          <p className="mt-2 text-muted">Test your knowledge with multiple choice questions and instant feedback.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔄</div>
          <h3>Interactive Flashcards</h3>
          <p className="mt-2 text-muted">Review concepts with flip animations and self-assessment tools.</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📈</div>
          <h3>Progress Tracking</h3>
          <p className="mt-2 text-muted">Monitor your scores and identify areas that need more practice.</p>
        </div>
      </div>
    </div>
  );
}
