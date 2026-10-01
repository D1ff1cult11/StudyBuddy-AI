import { BookOpen, Plus, Trash2, Download, Copy, Check, Play, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { sound } from '../utils/audio';

interface Deck {
  id: number;
  title: string;
  createdAt?: number;
  cards: { id: number; front: string; back: string; tag?: string; mnemonic?: string }[];
}

export function Library() {
  const navigate = useNavigate();
  const [decks, setDecks] = useState<Deck[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('study_decks') || '[]');
    } catch {
      return [];
    }
  });
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    const updated = decks.filter(d => d.id !== id);
    setDecks(updated);
    localStorage.setItem('study_decks', JSON.stringify(updated));
    sound.playAgain();
  };

  const handleStudyDeck = (id: number) => {
    localStorage.setItem('active_deck_id', String(id));
    sound.playFlip();
    navigate('/study');
  };

  const exportAnki = (deck: Deck) => {
    // Standard Anki tab-delimited format (Front \t Back \t Tags)
    const content = deck.cards
      .map(c => `${c.front.replace(/\t/g, ' ')}\t${c.back.replace(/\t/g, ' ')}\t${c.tag || 'StudyBuddy'}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${deck.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_anki.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    sound.playSuccess();
  };

  const copyMarkdown = (deck: Deck) => {
    const md = `# ${deck.title}\n\n` + deck.cards.map((c, i) => (
      `### Card ${i + 1}: ${c.front}\n- **Answer:** ${c.back}\n${c.mnemonic ? `- *💡 Memory Hook:* ${c.mnemonic}\n` : ''}`
    )).join('\n');

    navigator.clipboard.writeText(md);
    setCopiedId(deck.id);
    sound.playSuccess();
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="animate-slide-up">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>Your Library</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {decks.length} {decks.length === 1 ? 'deck' : 'decks'} saved & ready for active recall
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            className="btn-glass"
            style={{ padding: '0.55rem 0.8rem', fontSize: '0.82rem' }}
            onClick={() => navigate('/lms')}
          >
            <GraduationCap size={15} />
            Sync LMS
          </button>
          <button
            className="btn-primary"
            style={{ padding: '0.55rem 0.85rem', fontSize: '0.82rem' }}
            onClick={() => navigate('/scan')}
          >
            <Plus size={15} />
            New Deck
          </button>
        </div>
      </header>

      {decks.length === 0 ? (
        <div style={{ 
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: '1.5rem', padding: '3.5rem 1.5rem', textAlign: 'center'
        }}>
          <div style={{ 
            padding: '1.5rem', background: 'rgba(139, 92, 246, 0.08)', borderRadius: '50%',
            border: '2px dashed var(--border-focus)'
          }}>
            <BookOpen size={46} color="var(--accent-primary)" style={{ opacity: 0.6 }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>No study decks yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '270px', lineHeight: 1.6 }}>
              Scan your lecture notes or upload a photo to generate your first AI deck.
            </p>
          </div>
          <button className="btn-primary" onClick={() => navigate('/scan')}>
            <Plus size={18} />
            Scan First Deck
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {decks.map((deck) => (
            <div
              key={deck.id}
              className="glass-panel"
              style={{
                padding: '1.1rem', 
                display: 'flex', 
                flexDirection: 'column',
                gap: '0.85rem',
                transition: 'all 0.2s',
                border: '1px solid rgba(255, 255, 255, 0.08)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1 }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.12)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                    <BookOpen size={22} color="var(--accent-primary)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {deck.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {deck.cards.length} cards • SM-2 enabled
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(deck.id)}
                  style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem',
                    color: 'var(--text-muted)', transition: 'color 0.15s'
                  }}
                  title="Delete deck"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Action Toolbar */}
              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '0.75rem' }}>
                <button
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}
                  onClick={() => handleStudyDeck(deck.id)}
                >
                  <Play size={14} /> Study
                </button>

                <button
                  className="btn-glass"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => exportAnki(deck)}
                  title="Export to Anki file"
                >
                  <Download size={14} /> Anki (.txt)
                </button>

                <button
                  className="btn-glass"
                  style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
                  onClick={() => copyMarkdown(deck)}
                  title="Copy as Markdown"
                >
                  {copiedId === deck.id ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
