"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Question {
  id: string;
  text: string;
  options: string; // JSON string
  correctOption: number;
}

export default function QuizPage() {
  const params = useParams();
  const topicId = params.topicId as string;
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [parsedOptions, setParsedOptions] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [timeTaken, setTimeTaken] = useState(0);
  const [showReview, setShowReview] = useState(false);
  
  const [xpEarned, setXpEarned] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isFinished && !loading && questions.length > 0) {
      interval = setInterval(() => {
        setTimeTaken(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isFinished, loading, questions.length]);

  useEffect(() => {
    if (topicId) {
      fetch(`/api/topics/${topicId}/questions`)
        .then(res => res.json())
        .then((data: Question[]) => {
          const shuffled = [...data].sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
          setParsedOptions(shuffled.map(q => JSON.parse(q.options)));
          setUserAnswers(new Array(shuffled.length).fill(null));
          setLoading(false);
        })
        .catch(console.error);
    }
  }, [topicId]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentIndex] = selectedOption;
    setUserAnswers(newUserAnswers);
    
    if (selectedOption === questions[currentIndex].correctOption) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === questions[currentIndex].correctOption ? 1 : 0);
      
      // Calculate Wrong Answers
      const wrongIds: string[] = [];
      userAnswers.forEach((ans, idx) => {
        // If current question just submitted, check it
        const actualAns = idx === currentIndex ? selectedOption : ans;
        if (actualAns !== questions[idx].correctOption) {
          wrongIds.push(questions[idx].id);
        }
      });
      
      // Save stats to DB
      try {
        const res = await fetch('/api/quiz/finish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: finalScore, total: questions.length, wrongQuestionIds: wrongIds })
        });
        const data = await res.json();
        if (data.xpEarned) setXpEarned(data.xpEarned);
      } catch (err) {
        console.error("Failed to save XP");
      }

      if ((finalScore / questions.length) >= 0.8) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="container text-center mt-5"><h2>Loading Quiz...</h2></div>;
  if (questions.length === 0) return <div className="container text-center mt-5"><h2>No questions available.</h2></div>;

  if (isFinished) {
    if (showReview) {
      return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="flex justify-between items-center mb-4">
            <h2>Quiz Review</h2>
            <button className="btn btn-outline" onClick={() => setShowReview(false)}>Back to Summary</button>
          </div>
          {questions.map((q, idx) => {
            const opts = parsedOptions[idx];
            const uAns = userAnswers[idx];
            const isCorrect = uAns === q.correctOption;
            return (
              <div key={q.id} className="card mb-4" style={{ borderColor: isCorrect ? 'var(--success-color)' : 'var(--danger-color)' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}><ReactMarkdown remarkPlugins={[remarkGfm]}>{`${idx + 1}. ${q.text}`}</ReactMarkdown></h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {opts.map((o, oIdx) => {
                    let color = 'var(--text-secondary)';
                    let fw = 'normal';
                    if (oIdx === q.correctOption) { color = 'var(--success-color)'; fw = 'bold'; } 
                    else if (oIdx === uAns) { color = 'var(--danger-color)'; fw = 'bold'; }
                    return <li key={oIdx} style={{ color, fontWeight: fw, padding: '4px 0' }}>{o} {oIdx === uAns && '(Your Answer)'} {oIdx === q.correctOption && '(Correct)'}</li>
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div className="container text-center mt-5 card mx-auto" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Quiz Finished!</h2>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '10px' }}>
          {score + (selectedOption === questions[currentIndex]?.correctOption && !isAnswered ? 1 : 0)} / {questions.length}
        </div>
        
        {xpEarned > 0 && (
          <div className="mb-4" style={{ display: 'inline-block', padding: '10px 20px', background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))', borderRadius: '30px', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
            +{xpEarned} XP Earned! 🚀
          </div>
        )}
        
        <p className="text-muted mb-4">Time Taken: {formatTime(timeTaken)}</p>
        
        <div className="flex gap-2 justify-center flex-wrap">
          <button className="btn btn-outline" onClick={() => window.location.reload()}>Retake Quiz</button>
          <button className="btn btn-outline" onClick={() => setShowReview(true)}>Review Answers</button>
          <Link href={`/dashboard`} className="btn btn-primary">Go to Dashboard</Link>
        </div>
      </div>
    );
  }

  const question = questions[currentIndex];
  const options = parsedOptions[currentIndex];
  const progress = ((currentIndex) / questions.length) * 100;

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${progress}%`, backgroundColor: 'var(--primary-color)', transition: 'width 0.3s' }}></div>
      </div>

      <div className="flex justify-between items-center mb-4 text-muted">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{formatTime(timeTaken)}</span>
        <span>Score: {score}</span>
      </div>
      
      <div className="card mb-4">
        <div className="mb-4 markdown-content" style={{ fontSize: '1.2rem', lineHeight: '1.5' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.text}</ReactMarkdown>
        </div>
        
        <div>
          {options.map((opt, idx) => {
            let className = "quiz-option";
            if (isAnswered) {
              if (idx === question.correctOption) className += " correct";
              else if (idx === selectedOption) className += " incorrect";
            } else if (idx === selectedOption) className += " selected";
            
            return (
              <button key={idx} className={className} onClick={() => handleSelectOption(idx)} disabled={isAnswered}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{opt}</ReactMarkdown>
              </button>
            );
          })}
        </div>
      </div>
      
      <div className="flex justify-end mt-4 gap-2">
        {!isAnswered ? (
          <>
            <button className="btn btn-outline" onClick={() => { setIsAnswered(true); setSelectedOption(null); handleNext(); }}>Skip</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={selectedOption === null}>Submit Answer</button>
          </>
        ) : (
          <button className="btn btn-success" onClick={handleNext}>{currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}</button>
        )}
      </div>
    </div>
  );
}
