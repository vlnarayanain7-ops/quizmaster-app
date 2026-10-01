"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function TopicAdminPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [activeTab, setActiveTab] = useState<'questions' | 'flashcards'>('questions');
  
  // Question State
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState(["", "", "", ""]);
  const [qCorrect, setQCorrect] = useState(0);
  
  // Flashcard State
  const [fFront, setFFront] = useState("");
  const [fBack, setFBack] = useState("");

  const handleCreateQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/topics/${topicId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          text: qText, 
          options: qOptions, 
          correctOption: qCorrect 
        }),
      });
      if (res.ok) {
        alert("Question added!");
        setQText("");
        setQOptions(["", "", "", ""]);
        setQCorrect(0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...qOptions];
    newOptions[index] = value;
    setQOptions(newOptions);
  };

  const handleCreateFlashcard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/topics/${topicId}/flashcards`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ front: fFront, back: fBack }),
      });
      if (res.ok) {
        alert("Flashcard added!");
        setFFront("");
        setFBack("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="mb-4">
        <h1>Topic Content Manager</h1>
        <p className="text-muted mt-2">Add questions or flashcards to this topic.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button 
          className={`btn ${activeTab === 'questions' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('questions')}
        >
          Add Questions
        </button>
        <button 
          className={`btn ${activeTab === 'flashcards' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setActiveTab('flashcards')}
        >
          Add Flashcards
        </button>
      </div>

      {activeTab === 'questions' ? (
        <div className="card">
          <h2 className="mb-4">New Multiple Choice Question</h2>
          <form onSubmit={handleCreateQuestion}>
            <div className="form-group">
              <label className="form-label">Question Text</label>
              <input 
                type="text" 
                className="form-control" 
                value={qText} 
                onChange={e => setQText(e.target.value)} 
                required 
              />
            </div>
            
            <label className="form-label mb-2">Options</label>
            {qOptions.map((opt, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input 
                  type="radio" 
                  name="correctOption" 
                  checked={qCorrect === idx} 
                  onChange={() => setQCorrect(idx)} 
                />
                <input 
                  type="text" 
                  className="form-control" 
                  value={opt} 
                  onChange={e => handleOptionChange(idx, e.target.value)} 
                  required 
                  placeholder={`Option ${idx + 1}`}
                />
              </div>
            ))}
            <p className="text-muted mb-4 text-sm" style={{ fontSize: '0.85rem' }}>Select the radio button next to the correct option.</p>
            
            <button type="submit" className="btn btn-success">Save Question</button>
          </form>
        </div>
      ) : (
        <div className="card">
          <h2 className="mb-4">New Flashcard</h2>
          <form onSubmit={handleCreateFlashcard}>
            <div className="form-group">
              <label className="form-label">Front (Concept/Question)</label>
              <textarea 
                className="form-control" 
                value={fFront} 
                onChange={e => setFFront(e.target.value)} 
                required 
                rows={3}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Back (Answer/Definition)</label>
              <textarea 
                className="form-control" 
                value={fBack} 
                onChange={e => setFBack(e.target.value)} 
                required 
                rows={4}
              />
            </div>
            <button type="submit" className="btn btn-success">Save Flashcard</button>
          </form>
        </div>
      )}
      
      <div className="mt-5 text-center">
        <Link href={`/topics/${topicId}/quiz`} className="btn btn-outline mr-2" style={{ marginRight: '10px' }}>Preview Quiz</Link>
        <Link href={`/topics/${topicId}/flashcards`} className="btn btn-outline">Preview Flashcards</Link>
      </div>
    </div>
  );
}
