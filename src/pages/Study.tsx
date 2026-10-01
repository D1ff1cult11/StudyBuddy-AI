import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, BrainCircuit, RotateCcw, Lightbulb, Sparkles, Volume2, VolumeX, Mic, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Flashcard } from '../utils/ai-agent';
import { launchConfetti } from '../utils/confetti';
import { sound } from '../utils/audio';
import { calculateNextReview, createInitialReview, loadReviews, saveReviews, type ReviewQuality, type CardReview } from '../utils/spaced-repetition';
import { voiceTutor } from '../utils/voice-agent';

const DEFAULT_FALLBACK_CARDS: Flashcard[] = [
  { 
    id: 101, 
    front: "What is the primary function of mitochondria in eukaryotic cells?", 
    back: "To generate the majority of cellular ATP via oxidative phosphorylation and the Krebs cycle.",
    tag: "Bioenergetics",
    mnemonic: "Mighty Mitochondria makes ATP Currency",
    difficulty: "easy"
  },
  { 
    id: 102, 
    front: "How do rough and smooth endoplasmic reticulum differ functionally?", 
    back: "Rough ER has ribosomes for protein synthesis; Smooth ER synthesizes lipids and detoxifies chemicals.",
    tag: "Cell Biology",
    mnemonic: "Rough = Ribosomes, Smooth = Steroids/Lipids",
    difficulty: "medium"
  },
  { 
    id: 103, 
    front: "What is the role of the Golgi apparatus in vesicular transport?", 
    back: "Post-translational modification, sorting, and packaging of macromolecules into secretory vesicles.",
    tag: "Cell Biology",
    mnemonic: "Golgi is the cell's FedEx sorting warehouse",
    difficulty: "medium"
  },
  {
    id: 104,
    front: "Why is DNA replication termed 'semi-conservative'?",
    back: "Each daughter DNA molecule preserves one parental template strand and one newly synthesized strand.",
    tag: "Genetics",
    mnemonic: "Meselson-Stahl: 1 Old + 1 New",
    difficulty: "hard"
  }
];

export function Study() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [reviews, setReviews] = useState<CardReview[]>(() => loadReviews());
  const [cards] = useState<Flashcard[]>(() => {
    try {
      const decks = JSON.parse(localStorage.getItem('study_decks') || '[]');
      if (decks.length > 0) {
        const activeId = localStorage.getItem('active_deck_id');
        const targetDeck = (activeId && decks.find((d: any) => d.id === Number(activeId))) || decks[decks.length - 1];
        if (targetDeck?.cards && targetDeck.cards.length > 0) {
          return targetDeck.cards;
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_FALLBACK_CARDS;
  });
  const [soundEnabled, setSoundEnabled] = useState(sound.isEnabled());

  // Gemini Live Voice Tutor State
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState<'idle' | 'speaking' | 'listening' | 'evaluating'>('idle');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);

  const currentCard = cards[currentIndex];

  const handleFlip = useCallback(() => {
    sound.playFlip();
    setIsFlipped(prev => !prev);
  }, []);

  // Scientific SM-2 spaced repetition rating
  const handleRate = useCallback((quality: ReviewQuality) => {
    if (!currentCard) return;

    // Calculate SM-2 update
    const existingReview = reviews.find(r => r.cardId === currentCard.id) || createInitialReview(currentCard.id);
    const updatedReview = calculateNextReview(existingReview, quality);
    const newReviews = [...reviews.filter(r => r.cardId !== currentCard.id), updatedReview];
    setReviews(newReviews);
    saveReviews(newReviews);

    // Audio cue
    if (quality <= 1) {
      sound.playAgain();
    } else {
      sound.playSuccess();
    }

    // Advance to next card or complete
    if (currentIndex >= cards.length - 1) {
      setCompleted(true);
      sound.playFanfare();
      launchConfetti();
      return;
    }

    setDirection(quality >= 3 ? 1 : -1);
    setIsFlipped(false);
    setLiveTranscript('');
    setVoiceFeedback(null);
    setTimeout(() => setCurrentIndex(prev => prev + 1), 160);
  }, [cards, currentIndex, currentCard, reviews]);

  // Voice Tutor Interactive Flow
  const startVoiceForCurrentCard = useCallback(async () => {
    if (!currentCard || !isVoiceMode) return;
    setVoiceStatus('speaking');
    setLiveTranscript('');
    setVoiceFeedback(null);
    
    // 1. Speak question aloud
    await voiceTutor.speak(currentCard.front);
    
    // 2. Listen for student's spoken answer
    setVoiceStatus('listening');
    try {
      const studentAnswer = await voiceTutor.listen((interim) => {
        setLiveTranscript(interim);
      });
      
      setLiveTranscript(studentAnswer);
      if (studentAnswer.trim()) {
        setVoiceStatus('evaluating');
        const evalResult = await voiceTutor.evaluateAnswer(currentCard.front, currentCard.back, studentAnswer);
        setVoiceFeedback(evalResult.feedback);
        setIsFlipped(true); // Flip card to show answer
        
        // 3. Speak pedagogical feedback aloud
        setVoiceStatus('speaking');
        await voiceTutor.speak(evalResult.feedback);
        
        // Auto-rate with SM-2 after speaking
        setTimeout(() => {
          handleRate(evalResult.isCorrect ? 4 : 2);
        }, 1600);
      } else {
        setVoiceStatus('idle');
      }
    } catch {
      setVoiceStatus('idle');
    }
  }, [currentCard, isVoiceMode, handleRate]);

  useEffect(() => {
    let timer: any;
    if (isVoiceMode && !completed && currentCard) {
      timer = setTimeout(() => {
        startVoiceForCurrentCard();
      }, 50);
    } else {
      voiceTutor.stopSpeaking();
      voiceTutor.stopListening();
    }
    return () => {
      clearTimeout(timer);
      voiceTutor.stopSpeaking();
      voiceTutor.stopListening();
    };
  }, [isVoiceMode, currentIndex, completed, startVoiceForCurrentCard, currentCard]);

  // Keyboard navigation for power users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (completed) return;
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        handleFlip();
      } else if (isFlipped) {
        if (e.key === '1') handleRate(1);
        if (e.key === '2') handleRate(3);
        if (e.key === '3') handleRate(4);
        if (e.key === '4') handleRate(5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [completed, isFlipped, handleFlip, handleRate]);

  const toggleSound = () => {
    const newState = sound.toggle();
    setSoundEnabled(newState);
  };

  const toggleVoiceMode = () => {
    const next = !isVoiceMode;
    setIsVoiceMode(next);
    sound.playFlip();
    if (!next) {
      voiceTutor.stopSpeaking();
      voiceTutor.stopListening();
      setVoiceStatus('idle');
    }
  };

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 280 : -280,
      opacity: 0,
      scale: 0.92,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 280 : -280,
      opacity: 0,
      scale: 0.92,
    })
  };

  if (cards.length === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading study deck...</p>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.75rem', textAlign: 'center' }}>
        <div style={{ padding: '1.5rem', background: 'rgba(217, 70, 239, 0.12)', borderRadius: '50%', boxShadow: '0 0 32px rgba(217, 70, 239, 0.3)' }}>
          <BrainCircuit size={68} color="var(--accent-secondary)" />
        </div>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }} className="text-gradient">Session Mastered!</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '280px', margin: '0 auto' }}>
            Reviewed {cards.length} cards. Next intervals calibrated via SM-2 algorithm.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '320px' }}>
          <button className="btn-glass" style={{ flex: 1, padding: '0.9rem' }} onClick={() => { setCurrentIndex(0); setCompleted(false); setIsFlipped(false); }}>
            <RotateCcw size={16} /> Review Again
          </button>
          <button className="btn-primary" style={{ flex: 1, padding: '0.9rem' }} onClick={() => navigate('/')}>
            Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Bar */}
      <header style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <ChevronLeft size={24} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ background: 'var(--bg-glass)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${((currentIndex + 1) / cards.length) * 100}%`, background: 'var(--accent-gradient)', transition: 'width 0.3s ease' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Card {currentIndex + 1} of {cards.length}</span>
            {currentCard.tag && (
              <span style={{ fontSize: '0.72rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                {currentCard.tag}
              </span>
            )}
          </div>
        </div>

        {/* Gemini Live Voice Tutor Toggle */}
        <button 
          onClick={toggleVoiceMode} 
          style={{ 
            background: isVoiceMode ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.06)', 
            border: isVoiceMode ? 'none' : '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '2rem', 
            padding: '0.35rem 0.65rem', 
            color: 'white', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.3rem',
            fontSize: '0.72rem',
            fontWeight: 700,
            fontFamily: 'Outfit, sans-serif',
            boxShadow: isVoiceMode ? '0 0 16px rgba(217, 70, 239, 0.4)' : 'none'
          }}
          title="Toggle Gemini Live Voice Tutor"
        >
          {isVoiceMode ? <Radio size={14} className="animate-pulse" /> : <Mic size={14} />}
          <span>Live AI</span>
        </button>

        <button onClick={toggleSound} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}>
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      </header>

      {/* Voice Mode Live Status Banner */}
      {isVoiceMode && (
        <div style={{
          background: 'rgba(217, 70, 239, 0.12)',
          border: '1px solid rgba(217, 70, 239, 0.3)',
          borderRadius: '0.75rem',
          padding: '0.65rem 0.9rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: voiceStatus === 'listening' ? '#ef4444' : voiceStatus === 'evaluating' ? '#f59e0b' : '#10b981',
            boxShadow: `0 0 10px ${voiceStatus === 'listening' ? '#ef4444' : '#10b981'}`,
            animation: 'pulse-glow 1s infinite'
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {voiceStatus === 'speaking' && "AI Tutor is speaking..."}
              {voiceStatus === 'listening' && "Listening... Speak your answer now"}
              {voiceStatus === 'evaluating' && "Gemini is evaluating your recall..."}
              {voiceStatus === 'idle' && "Hands-free voice tutor ready"}
            </span>
            {liveTranscript && (
              <p style={{ fontSize: '0.74rem', color: 'var(--text-primary)', margin: '0.15rem 0 0', fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                "{liveTranscript}"
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3D Card Flip Perspective Box */}
      <div style={{ flex: 1, position: 'relative', perspective: '1200px' }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            style={{ width: '100%', height: '100%', position: 'absolute' }}
            onClick={handleFlip}
          >
            <motion.div
              style={{
                width: '100%', height: '100%',
                position: 'relative',
                transformStyle: 'preserve-3d',
              }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
            >
              {/* Front Face: Question */}
              <div 
                className="glass-panel" 
                style={{
                  position: 'absolute', width: '100%', height: '100%',
                  backfaceVisibility: 'hidden',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem 1.5rem', textAlign: 'center', cursor: 'pointer',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  boxShadow: '0 12px 36px rgba(0, 0, 0, 0.4)'
                }}
              >
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  <Sparkles size={14} /> ACTIVE RECALL
                </div>

                <h3 style={{ fontSize: '1.35rem', lineHeight: 1.5, fontWeight: 600, color: 'var(--text-primary)' }}>
                  {currentCard.front}
                </h3>

                <p style={{ position: 'absolute', bottom: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  {isVoiceMode ? "Speak your answer or tap to flip" : "Tap card or press Space to reveal"}
                </p>
              </div>

              {/* Back Face: Answer + Mnemonic Hook */}
              <div 
                className="glass-panel" 
                style={{
                  position: 'absolute', width: '100%', height: '100%',
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '2rem 1.5rem', textAlign: 'center', cursor: 'pointer',
                  border: '1px solid rgba(217, 70, 239, 0.4)',
                  boxShadow: '0 12px 36px rgba(217, 70, 239, 0.15)'
                }}
              >
                <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', color: 'var(--accent-secondary)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em' }}>
                  EXPLANATION
                </div>

                <h3 style={{ fontSize: '1.2rem', lineHeight: 1.55, color: 'var(--text-primary)', marginBottom: '1.25rem', fontWeight: 500 }}>
                  {currentCard.back}
                </h3>

                {/* Socratic Voice Evaluation Feedback */}
                {voiceFeedback && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '0.75rem',
                    padding: '0.55rem 0.85rem',
                    marginBottom: '0.75rem',
                    maxWidth: '90%'
                  }}>
                    <p style={{ fontSize: '0.76rem', color: '#10b981', margin: 0, fontWeight: 600 }}>
                      🎙️ Socratic Feedback: {voiceFeedback}
                    </p>
                  </div>
                )}

                {/* Pedagogical Mnemonic Hook */}
                {currentCard.mnemonic && (
                  <div style={{
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.25)',
                    borderRadius: '0.75rem',
                    padding: '0.65rem 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    maxWidth: '90%'
                  }}>
                    <Lightbulb size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <p style={{ fontSize: '0.78rem', color: '#f59e0b', textAlign: 'left', lineHeight: 1.4, margin: 0, fontWeight: 500 }}>
                      <strong>Memory Hook:</strong> {currentCard.mnemonic}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4-Tier Scientific SM-2 Rating Controls */}
      <div style={{ 
        marginTop: '1.25rem', 
        opacity: isFlipped ? 1 : 0.25, 
        transition: 'opacity 0.25s', 
        pointerEvents: isFlipped ? 'auto' : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 0.25rem' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>How well did you recall?</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 600 }}>Keys 1 - 4</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.4rem' }}>
          {/* Again */}
          <button 
            onClick={() => handleRate(1)}
            className="glass-panel" 
            style={{ 
              padding: '0.65rem 0.2rem', 
              border: '1px solid rgba(239, 68, 68, 0.35)', 
              background: 'rgba(239, 68, 68, 0.08)',
              color: '#ef4444', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.15rem', 
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>Again</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>&lt; 10m</span>
          </button>

          {/* Hard */}
          <button 
            onClick={() => handleRate(3)}
            className="glass-panel" 
            style={{ 
              padding: '0.65rem 0.2rem', 
              border: '1px solid rgba(245, 158, 11, 0.35)', 
              background: 'rgba(245, 158, 11, 0.08)',
              color: '#f59e0b', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.15rem', 
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>Hard</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>12h</span>
          </button>

          {/* Good */}
          <button 
            onClick={() => handleRate(4)}
            className="glass-panel" 
            style={{ 
              padding: '0.65rem 0.2rem', 
              border: '1px solid rgba(16, 185, 129, 0.35)', 
              background: 'rgba(16, 185, 129, 0.08)',
              color: '#10b981', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.15rem', 
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>Good</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>1d</span>
          </button>

          {/* Easy */}
          <button 
            onClick={() => handleRate(5)}
            className="glass-panel" 
            style={{ 
              padding: '0.65rem 0.2rem', 
              border: '1px solid rgba(59, 130, 246, 0.35)', 
              background: 'rgba(59, 130, 246, 0.08)',
              color: '#3b82f6', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.15rem', 
              cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif'
            }}
          >
            <span style={{ fontWeight: 700, fontSize: '0.82rem' }}>Easy</span>
            <span style={{ fontSize: '0.65rem', opacity: 0.8 }}>4d</span>
          </button>
        </div>
      </div>
    </div>
  );
}
