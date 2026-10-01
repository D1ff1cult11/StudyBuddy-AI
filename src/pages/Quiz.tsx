import { useState, useEffect, useCallback } from 'react';
import { CheckCircle2, XCircle, ArrowRight, RotateCcw, BrainCircuit, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { launchConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export function Quiz() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);

  const generateQuiz = useCallback(async () => {
    const apiKey = import.meta.env.VITE_AI_API_KEY;
    
    // Get text from latest deck or use defaults
    const decks = JSON.parse(localStorage.getItem('study_decks') || '[]');
    const latestDeck = decks[decks.length - 1];
    let contextText = "The mitochondria generates ATP. The Golgi apparatus packages proteins. Rough ER has ribosomes. DNA replication is semi-conservative.";
    
    if (latestDeck?.cards?.length > 0) {
      contextText = latestDeck.cards.map((c: any) => `${c.front} Answer: ${c.back}`).join('. ');
    }

    if (apiKey && apiKey !== 'your_api_key_here') {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: `Generate exactly 5 multiple-choice quiz questions from this study material. Return ONLY a valid JSON array where each object has: "question" (string), "options" (array of 4 strings), "correctIndex" (number 0-3). Material: ${contextText}` }]
            }]
          })
        });
        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        setQuestions(parsed);
        setLoading(false);
        return;
      } catch (e) {
        console.error('Quiz generation failed, using fallback', e);
      }
    }

    // Fallback quiz
    await new Promise(r => setTimeout(r, 1000));
    setQuestions([
      { question: "What is the primary function of mitochondria?", options: ["Protein synthesis", "ATP production", "DNA replication", "Cell division"], correctIndex: 1 },
      { question: "Which organelle packages proteins?", options: ["Nucleus", "Ribosome", "Golgi apparatus", "Lysosome"], correctIndex: 2 },
      { question: "What does rough ER have that smooth ER doesn't?", options: ["Mitochondria", "Ribosomes", "Chloroplasts", "Vacuoles"], correctIndex: 1 },
      { question: "DNA replication is described as:", options: ["Conservative", "Semi-conservative", "Dispersive", "Random"], correctIndex: 1 },
      { question: "What carries amino acids during translation?", options: ["mRNA", "rRNA", "tRNA", "DNA"], correctIndex: 2 },
    ]);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      generateQuiz();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateQuiz]);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    if (index === questions[current].correctIndex) {
      setScore(s => s + 1);
      sound.playSuccess();
    } else {
      sound.playAgain();
    }
  };

  const handleNext = () => {
    sound.playFlip();
    if (current === questions.length - 1) {
      setFinished(true);
      if (score >= questions.length * 0.8) {
        sound.playFanfare();
        launchConfetti();
      }
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <BrainCircuit size={56} color="var(--accent-secondary)" className="animate-float" />
        <div style={{ textAlign: 'center' }}>
          <h3 className="text-gradient" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Generating Quiz...</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>AI is creating questions from your study material</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: percentage >= 80 ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `3px solid ${percentage >= 80 ? '#10b981' : '#f59e0b'}`,
        }}>
          <span style={{ fontSize: '2.5rem', fontWeight: 800 }}>{percentage}%</span>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }} className="text-gradient">
            {percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good Job!' : 'Keep Practicing!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)' }}>{score}/{questions.length} correct answers</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '320px' }}>
          <button className="btn-glass" style={{ flex: 1 }} onClick={() => navigate('/')}>
            <RotateCcw size={16} /> Home
          </button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => { setCurrent(0); setScore(0); setSelected(null); setFinished(false); generateQuiz(); }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '2px' }}>
          <ChevronLeft size={22} />
        </button>
        <span style={{ fontSize: '0.92rem', fontWeight: 700 }}>AI Diagnostic Quiz</span>
      </div>

      {/* Progress */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Question {current + 1}/{questions.length}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700 }}>Score: {score}</span>
        </div>
        <div style={{ background: 'var(--bg-glass)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${((current + 1) / questions.length) * 100}%`, background: 'var(--accent-gradient)', transition: 'width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }} />
        </div>
      </div>

      {/* Question */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.15rem', lineHeight: 1.5, fontWeight: 600 }}>{q.question}</h3>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        {q.options.map((option, i) => {
          const isCorrect = i === q.correctIndex;
          const isSelected = i === selected;
          const showResult = selected !== null;

          let borderColor = 'var(--border-glass)';
          let bg = 'var(--bg-glass)';
          if (showResult && isCorrect) { borderColor = '#10b981'; bg = 'rgba(16,185,129,0.1)'; }
          if (showResult && isSelected && !isCorrect) { borderColor = '#ef4444'; bg = 'rgba(239,68,68,0.08)'; }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className="glass-panel"
              style={{
                padding: '1rem 1.25rem', textAlign: 'left', cursor: showResult ? 'default' : 'pointer',
                border: `2px solid ${borderColor}`, background: bg,
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', color: 'var(--text-primary)',
                transition: 'all 0.2s',
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: showResult && isCorrect ? '#10b981' : showResult && isSelected ? '#ef4444' : 'rgba(255,255,255,0.06)',
                fontSize: '0.8rem', fontWeight: 700,
                color: showResult && (isCorrect || isSelected) ? 'white' : 'var(--text-secondary)',
              }}>
                {showResult && isCorrect ? <CheckCircle2 size={16} /> : showResult && isSelected ? <XCircle size={16} /> : String.fromCharCode(65 + i)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      {selected !== null && (
        <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }} onClick={handleNext}>
          {current === questions.length - 1 ? 'See Results' : 'Next Question'}
          <ArrowRight size={18} />
        </button>
      )}
    </div>
  );
}
