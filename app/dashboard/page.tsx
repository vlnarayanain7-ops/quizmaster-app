"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface UserStats {
  name: string;
  xp: number;
  level: number;
  streak: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from /api/user/me
    // Since we are mocking login, we'll fetch the hardcoded admin user
    fetch('/api/user/admin')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  if (loading) return <div className="container text-center mt-5">Loading Dashboard...</div>;
  if (!stats) return <div className="container text-center mt-5">User not found</div>;

  const xpForNextLevel = stats.level * 500;
  const progress = (stats.xp / xpForNextLevel) * 100;

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 className="mb-4">Student Dashboard</h1>
      
      <div className="grid">
        {/* Profile Card */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="flex items-center gap-4 mb-4">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {stats.name.charAt(0)}
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '2rem' }}>{stats.name}</h2>
              <p className="text-muted" style={{ margin: 0 }}>Level {stats.level} Scholar</p>
            </div>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>🔥 {stats.streak}</div>
              <p className="text-muted" style={{ margin: 0 }}>Day Streak</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-muted">XP Progress</span>
              <span style={{ fontWeight: 'bold' }}>{stats.xp} / {xpForNextLevel} XP</span>
            </div>
            <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--surface-color-hover)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', transition: 'width 1s' }}></div>
            </div>
            <p className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>{xpForNextLevel - stats.xp} XP needed to reach Level {stats.level + 1}</p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="card text-center flex flex-col justify-center">
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📚</div>
          <h3>Browse Topics</h3>
          <p className="text-muted mt-2 mb-4">Explore new subjects and take quizzes.</p>
          <Link href="/subjects" className="btn btn-primary" style={{ width: '100%' }}>Go to Subjects</Link>
        </div>

        <div className="card text-center flex flex-col justify-center">
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎯</div>
          <h3>Weakness Review</h3>
          <p className="text-muted mt-2 mb-4">Practice the exact questions you got wrong.</p>
          <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => alert("Weakness targeting mode coming next!")}>Start Review Mode</button>
        </div>
      </div>
    </div>
  );
}
