import { BookOpen, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Deck {
  id: number;
  title: string;
  cards: { id: number; front: string; back: string }[];
}

export function Library() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('study_decks') || '[]');
    setDecks(stored);
  }, []);

  const handleDelete = (id: number) => {
    const updated = decks.filter(d => d.id !== id);
    setDecks(updated);
    localStorage.setItem('study_decks', JSON.stringify(updated));
  };

  return (
    <div className="animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Your Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{decks.length} {decks.length === 1 ? 'deck' : 'decks'} saved</p>
        </div>
        <button
          className="btn-primary"
          style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}
          onClick={() => navigate('/scan')}
        >
          <Plus size={16} />
          New Deck
        </button>
      </header>

      {decks.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', padding: '4rem 2rem', textAlign: 'center'
        }}>
          <div style={{ 
            padding: '1.5rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '50%',
            border: '2px dashed var(--border-focus)'
          }}>
            <BookOpen size={48} color="var(--accent-primary)" style={{ opacity: 0.6 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No decks yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '260px', lineHeight: 1.6 }}>
              Scan your notes or paste text to create your first AI-powered study deck.
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/scan')}>
            <Plus size={18} />
            Create First Deck
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="glass-panel"
              style={{
                padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <div
                style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}
                onClick={() => navigate('/study')}
              >
                <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                  <BookOpen size={22} color="var(--accent-primary)" />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.95rem', marginBottom: '0.2rem' }}>{deck.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{deck.cards.length} cards</p>
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(deck.id); }}
                style={{ 
                  background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem',
                  color: 'var(--text-muted)', transition: 'color 0.2s'
                }}
                aria-label="Delete deck"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
