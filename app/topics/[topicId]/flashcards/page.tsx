"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export default function FlashcardsPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownCards, setKnownCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (topicId) {
      fetch(`/api/topics/${topicId}/flashcards`)
        .then(res => res.json())
        .then((data: Flashcard[]) => {
          // Feature 24: Shuffle Flashcards automatically
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setFlashcards(shuffled);
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [topicId]);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % flashcards.length);
    }, 150);
  }, [flashcards.length]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + flashcards.length) % flashcards.length);
    }, 150);
  }, [flashcards.length]);

  const markKnown = useCallback(() => {
    if (flashcards.length === 0) return;
    const cardId = flashcards[currentIndex].id;
    setKnownCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) {
        next.delete(cardId);
      } else {
        next.add(cardId);
      }
      return next;
    });
  }, [flashcards, currentIndex]);

  // Feature 18: Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      } else if (e.code === 'KeyK') {
        markKnown();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev, markKnown]);

  if (loading) return <div className="container" style={{textAlign: 'center', padding: '40px'}}><div style={{fontSize: '2rem'}}>Loading...</div></div>;
  if (flashcards.length === 0) return (
    <div className="container text-center mt-5">
      <h2>No flashcards available for this topic.</h2>
      <Link href={`/topics/${topicId}/admin`} className="btn btn-primary mt-3">Add Flashcards (Admin)</Link>
    </div>
  );

  const currentCard = flashcards[currentIndex];
  const isKnown = knownCards.has(currentCard.id);
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  return (
    <div className="container text-center">
      <h1 className="mb-2">Flashcards</h1>
      <p className="text-muted mb-4">
        Card {currentIndex + 1} of {flashcards.length} &middot; Known: {knownCards.size}
      </p>
      
      <div style={{ width: '100%', maxWidth: '600px', height: '4px', backgroundColor: 'var(--border-color)', borderRadius: '2px', margin: '0 auto 20px auto', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--success-color)', transition: 'width 0.3s' }}></div>
      </div>

      <div className="flashcard-container" onClick={handleFlip}>
        <div className={`flashcard ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="flashcard-face">
            {currentCard.front}
          </div>
          <div className="flashcard-face flashcard-back">
            {currentCard.back}
          </div>
        </div>
      </div>

      <div className="mt-5 flex justify-center gap-4 items-center">
        <button className="btn btn-outline" onClick={handlePrev}>&larr; Prev</button>
        
        <button 
          className={`btn ${isKnown ? 'btn-success' : 'btn-outline'}`} 
          onClick={markKnown}
        >
          {isKnown ? 'Marked as Known' : 'Mark as Known (K)'}
        </button>

        <button className="btn btn-outline" onClick={handleNext}>Next &rarr;</button>
      </div>
      
      <p className="text-muted mt-4" style={{ fontSize: '0.85rem' }}>
        Keyboard shortcuts: <kbd>Space</kbd> Flip &middot; <kbd>&larr;</kbd> <kbd>&rarr;</kbd> Navigate &middot; <kbd>K</kbd> Mark Known
      </p>
      
      <div className="mt-5">
        <Link href={`/topics/${topicId}/quiz`} className="btn btn-primary">Take Quiz Instead</Link>
      </div>
    </div>
  );
}
