import { Sparkles, Brain, BookOpen, ChevronRight, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  return (
    <div className="animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
            Hi, Student 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to crush your exams?</p>
        </div>
        <button 
          onClick={() => navigate('/paywall')}
          style={{ 
            background: 'var(--accent-gradient)', 
            border: 'none', 
            borderRadius: '2rem', 
            padding: '0.5rem 1rem', 
            color: 'white', 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(217, 70, 239, 0.4)'
          }}
        >
          <Zap size={16} /> PRO
        </button>
      </header>

      {/* Hero CTA */}
      <section className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            <span className="text-gradient">Magic Scan</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.25rem', fontSize: '0.9rem', maxWidth: '80%' }}>
            Turn messy handwritten notes into smart flashcards in seconds.
          </p>
          <button className="btn-primary" onClick={() => navigate('/scan')}>
            <Sparkles size={18} />
            Scan Notes Now
          </button>
        </div>
        <div className="animate-float" style={{ position: 'absolute', right: '-10px', top: '10px', opacity: 0.8 }}>
          <Zap size={100} color="var(--accent-secondary)" style={{ filter: 'drop-shadow(0 0 20px rgba(217, 70, 239, 0.5))' }} />
        </div>
      </section>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)' }}>
            <Brain size={20} />
            <span style={{ fontWeight: 600 }}>Cards Mastered</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>248</span>
        </div>
        <div className="glass-panel" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}>
            <Zap size={20} />
            <span style={{ fontWeight: 600 }}>Current Streak</span>
          </div>
          <span style={{ fontSize: '2rem', fontWeight: 700 }}>12<span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}> days</span></span>
        </div>
      </div>

      {/* Recent Decks */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Recent Study Decks</h3>
          <span style={{ color: 'var(--accent-primary)', fontSize: '0.9rem', cursor: 'pointer' }}>See all</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { title: 'Biology Ch 4: Cell Structure', cards: 42, progress: 85 },
            { title: 'History: World War II', cards: 18, progress: 40 },
            { title: 'Physics Form 5', cards: 56, progress: 12 },
          ].map((deck, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => navigate('/study')} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                <BookOpen size={24} color="var(--accent-primary)" />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{deck.title}</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>{deck.cards} cards</span>
                  <span>•</span>
                  <span>{deck.progress}% learned</span>
                </div>
              </div>
              <ChevronRight size={20} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
