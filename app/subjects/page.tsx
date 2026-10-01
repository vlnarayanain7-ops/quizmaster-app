"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Subject {
  id: string;
  name: string;
  description: string;
  _count: { topics: number };
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For creating new subject
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        setShowForm(false);
        fetchSubjects();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center', padding: '40px'}}><div style={{fontSize: '2rem'}}>Loading...</div></div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h2>Available Subjects</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Subject"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Subject Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Mathematics"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea 
                className="form-control" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the subject..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-success">Create Subject</button>
          </form>
        </div>
      )}

      {subjects.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <p className="text-muted mb-3" style={{ fontSize: '1.2rem' }}>No subjects available yet.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>Be the first to add one!</button>
        </div>
      ) : (
        <div className="grid">
          {subjects.map(subject => (
            <Link href={`/subjects/${subject.id}`} key={subject.id}>
              <div className="card">
                <h3>{subject.name}</h3>
                {subject.description && <p className="mt-2 text-muted">{subject.description}</p>}
                <div className="mt-4" style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: 'var(--bg-color)', borderRadius: '20px', fontSize: '0.9rem', color: 'var(--accent-color)' }}>
                  {subject._count.topics} Topics
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
