import { Sparkles, Brain, BookOpen, ChevronRight, Zap, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export function Home() {
  const navigate = useNavigate();
  const [deckCount, setDeckCount] = useState(0);

  useEffect(() => {
    const decks = JSON.parse(localStorage.getItem('study_decks') || '[]');
    setDeckCount(decks.length);
  }, []);

  return (
    <div className="animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', marginBottom: '0.15rem', letterSpacing: '-0.03em' }}>
            Hi, Student 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ready to crush your exams?</p>
        </div>
        <button 
          onClick={() => navigate('/paywall')}
          style={{ 
            background: 'var(--accent-gradient)', 
            border: 'none', 
            borderRadius: '2rem', 
            padding: '0.45rem 0.9rem', 
            color: 'white', 
            fontWeight: 700, 
            fontFamily: 'Outfit, sans-serif',
            fontSize: '0.8rem',
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(217, 70, 239, 0.35)',
            transition: 'all 0.15s',
            letterSpacing: '0.02em'
          }}
        >
          <Zap size={14} /> PRO
        </button>
      </header>

      {/* Hero CTA */}
      <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
            <span className="text-gradient">Magic Scan</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.88rem', maxWidth: '80%', lineHeight: 1.6 }}>
            Turn messy handwritten notes into smart flashcards in seconds.
          </p>
          <button className="btn-primary" onClick={() => navigate('/scan')} style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
            <Sparkles size={16} />
            Scan Notes Now
          </button>
        </div>
        <div className="animate-float" style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.6 }}>
          <Zap size={90} color="var(--accent-secondary)" style={{ filter: 'drop-shadow(0 0 24px rgba(217, 70, 239, 0.4))' }} />
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)' }}>
            <Brain size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Cards Mastered</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>248</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-secondary)' }}>
            <TrendingUp size={18} />
            <span style={{ fontWeight: 600, fontSize: '0.8rem' }}>Streak</span>
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>12<span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}> days</span></span>
        </div>
      </div>

      {/* Recent Decks */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.05rem' }}>Recent Study Decks</h3>
          <span 
            onClick={() => navigate('/library')}
            style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
          >
            See all
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { title: 'Biology Ch 4: Cell Structure', cards: 42, progress: 85 },
            { title: 'History: World War II', cards: 18, progress: 40 },
            { title: 'Physics Form 5', cards: 56, progress: 12 },
          ].map((deck, i) => (
            <div 
              key={i} 
              className="glass-panel" 
              style={{ padding: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} 
              onClick={() => navigate('/study')}
            >
              <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '0.65rem', borderRadius: '0.75rem' }}>
                <BookOpen size={22} color="var(--accent-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '0.92rem', marginBottom: '0.2rem', fontWeight: 600 }}>{deck.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{deck.cards} cards</span>
                  {/* Mini progress bar */}
                  <div style={{ flex: 1, maxWidth: '80px', height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${deck.progress}%`, background: 'var(--accent-gradient)', borderRadius: '2px', transition: 'width 0.5s' }} />
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{deck.progress}%</span>
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          ))}
        </div>

        {/* Dynamic deck count from localStorage */}
        {deckCount > 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '1rem' }}>
            + {deckCount} AI-generated {deckCount === 1 ? 'deck' : 'decks'} in your library
          </p>
        )}
      </section>
    </div>
  );
}
