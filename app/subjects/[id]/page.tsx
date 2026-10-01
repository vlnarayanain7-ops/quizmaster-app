"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Topic {
  id: string;
  name: string;
  description: string;
  _count: { questions: number; flashcards: number };
}

interface Subject {
  id: string;
  name: string;
  description: string;
  topics: Topic[];
}

export default function SubjectDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchSubject = async () => {
    try {
      const res = await fetch(`/api/subjects/${id}/topics`);
      const data = await res.json();
      if (res.ok) setSubject(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchSubject();
  }, [id]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/subjects/${id}/topics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        setShowForm(false);
        fetchSubject();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container" style={{textAlign: 'center', padding: '40px'}}><div style={{fontSize: '2rem'}}>Loading...</div></div>;
  if (!subject) return <div className="container">Subject not found.</div>;

  return (
    <div className="container">
      <div className="mb-4">
        <Link href="/subjects" className="text-muted" style={{ display: 'inline-block', marginBottom: '10px' }}>&larr; Back to Subjects</Link>
        <h1>{subject.name}</h1>
        {subject.description && <p className="text-muted mt-2">{subject.description}</p>}
      </div>

      <div className="flex justify-between items-center mb-4 mt-5">
        <h2>Topics</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "Add Topic"}
        </button>
      </div>

      {showForm && (
        <div className="card mb-4" style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}>
          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label className="form-label">Topic Name</label>
              <input 
                type="text" 
                className="form-control" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
                placeholder="e.g. Algebra"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea 
                className="form-control" 
                value={description} 
                onChange={e => setDescription(e.target.value)}
                placeholder="Brief description of the topic..."
                rows={3}
              />
            </div>
            <button type="submit" className="btn btn-success">Create Topic</button>
          </form>
        </div>
      )}

      {subject.topics.length === 0 ? (
        <div className="card text-center" style={{ padding: '40px' }}>
          <p className="text-muted mb-3" style={{ fontSize: '1.2rem' }}>No topics available yet.</p>
        </div>
      ) : (
        <div className="grid">
          {subject.topics.map(topic => (
            <div className="card" key={topic.id}>
              <h3>{topic.name}</h3>
              {topic.description && <p className="mt-2 text-muted">{topic.description}</p>}
              <div className="flex gap-4 mt-4 mb-4 text-muted" style={{ fontSize: '0.9rem' }}>
                <span>{topic._count.questions} Questions</span>
                <span>{topic._count.flashcards} Flashcards</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Link href={`/topics/${topic.id}/quiz`} className="btn btn-primary flex-1 text-center" style={{ flex: 1 }}>
                  Take Quiz
                </Link>
                <Link href={`/topics/${topic.id}/flashcards`} className="btn btn-outline flex-1 text-center" style={{ flex: 1 }}>
                  Flashcards
                </Link>
              </div>
              <div className="mt-2">
                <Link href={`/topics/${topic.id}/admin`} className="btn flex-1 text-center" style={{ width: '100%', backgroundColor: 'var(--surface-color-hover)', color: 'white' }}>
                  Manage Contents (Admin)
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
