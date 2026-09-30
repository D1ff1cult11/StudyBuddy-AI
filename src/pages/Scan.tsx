import { useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, ArrowRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studyAgent } from '../utils/ai-agent';

export function Scan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'idle' | 'scanning' | 'processing' | 'success'>('idle');
  const [inputText, setInputText] = useState('');
  const [generatedCount, setGeneratedCount] = useState(0);
  const [mode, setMode] = useState<'camera' | 'paste'>('camera');

  const handleScan = async (text?: string) => {
    const ocrText = text || "The mitochondria is the powerhouse of the cell. It generates ATP through cellular respiration. The rough endoplasmic reticulum has ribosomes and produces proteins. The Golgi apparatus packages and sorts proteins.";
    
    setStep('scanning');

    setTimeout(async () => {
      setStep('processing');
      try {
        const cards = await studyAgent.generateFlashcards(ocrText);
        setGeneratedCount(cards.length);
        setStep('success');
      } catch (e) {
        console.error(e);
        setStep('idle');
      }
    }, 1500);
  };

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem' }}>Scan Notes</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Turn handwritten text to flashcards</p>
      </header>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
        
        {step === 'idle' && (
          <>
            {/* Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.5rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', padding: '4px' }}>
              <button 
                onClick={() => setMode('camera')}
                style={{ 
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  background: mode === 'camera' ? 'var(--accent-gradient)' : 'transparent', 
                  color: mode === 'camera' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                <Camera size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Camera
              </button>
              <button 
                onClick={() => setMode('paste')}
                style={{ 
                  padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  background: mode === 'paste' ? 'var(--accent-gradient)' : 'transparent', 
                  color: mode === 'paste' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s'
                }}
              >
                <FileText size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Paste Text
              </button>
            </div>

            {mode === 'camera' ? (
              <>
                <div className="glass-panel" style={{ width: '100%', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-focus)', cursor: 'pointer', gap: '1rem' }} onClick={() => handleScan()}>
                  <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%' }}>
                    <Camera size={48} color="var(--accent-primary)" />
                  </div>
                  <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Tap to capture notes</p>
                </div>
              </>
            ) : (
              <>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type your notes here...&#10;&#10;Example: The mitochondria is the powerhouse of the cell. It generates ATP through cellular respiration."
                  style={{
                    width: '100%', minHeight: '200px', padding: '1rem',
                    background: 'var(--bg-glass)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-md)',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.95rem', lineHeight: 1.6,
                    resize: 'vertical', outline: 'none'
                  }}
                />
                <button 
                  className="btn-primary" 
                  style={{ width: '100%' }} 
                  onClick={() => handleScan(inputText)}
                  disabled={inputText.trim().length < 10}
                >
                  <ImageIcon size={18} />
                  Generate Flashcards with AI
                </button>
              </>
            )}

            <button className="btn-glass" style={{ width: '100%' }} onClick={() => setMode(mode === 'camera' ? 'paste' : 'camera')}>
              <ImageIcon size={20} />
              {mode === 'camera' ? 'Or paste text instead' : 'Or use camera'}
            </button>
          </>
        )}

        {step === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Camera size={64} color="var(--accent-primary)" className="animate-pulse" />
              <div style={{ position: 'absolute', inset: -20, border: '2px solid var(--accent-secondary)', borderRadius: '50%', animation: 'pulse-glow 1.5s infinite' }} />
            </div>
            <h3 style={{ fontSize: '1.25rem' }}>Capturing image...</h3>
          </div>
        )}

        {step === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2 size={64} color="var(--accent-secondary)" style={{ animation: 'spin 2s linear infinite' }} />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }} className="text-gradient">AI is reading your notes</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Extracting key concepts & generating flashcards...</p>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
            <CheckCircle2 size={80} color="#10b981" />
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Success!</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Generated {generatedCount} flashcards from your notes.</p>
            </div>
            
            <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>New Study Deck</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>{generatedCount} new cards added</p>
              </div>
              <button className="btn-primary" style={{ padding: '0.75rem 1rem' }} onClick={() => navigate('/study')}>
                Study
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
