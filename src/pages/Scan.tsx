import { useState, useRef, useEffect } from 'react';
import { Camera, Loader2, CheckCircle2, ArrowRight, FileText, Upload, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studyAgent, type Flashcard } from '../utils/ai-agent';
import { sound } from '../utils/audio';
import { checkProStatus } from '../utils/revenuecat';

const SAMPLE_NOTES = [
  {
    title: "🧬 Cell Biology",
    text: "Mitochondria generate ATP through oxidative phosphorylation. The rough ER has ribosomes and synthesizes proteins, while the smooth ER handles lipid synthesis. The Golgi apparatus modifies and packages proteins into vesicles."
  },
  {
    title: "⚛️ Quantum Physics",
    text: "The photoelectric effect proved light has particle properties. Photons have energy E = hf. Wave-particle duality implies electrons exhibit de Broglie wavelength lambda = h/p. Heisenberg uncertainty principle states delta x * delta p >= hbar / 2."
  },
  {
    title: "📜 World History",
    text: "The Treaty of Versailles was signed in 1919 ending World War I. It imposed heavy war reparations on Germany and established the League of Nations, setting geopolitical conditions that contributed to WWII."
  }
];

export function Scan() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'idle' | 'scanning' | 'processing' | 'success'>('idle');
  const [inputText, setInputText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imagePayload, setImagePayload] = useState<{ base64: string; mimeType: string } | null>(null);
  const [generatedCards, setGeneratedCards] = useState<Flashcard[]>([]);
  const [mode, setMode] = useState<'camera' | 'paste'>('camera');
  const [statusMessage, setStatusMessage] = useState('Extracting key concepts...');
  const [isPro, setIsPro] = useState(false);
  const [scansUsed, setScansUsed] = useState(() => {
    try {
      return parseInt(localStorage.getItem('studybuddy_scans_used') || '0', 10);
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    checkProStatus().then(status => setIsPro(status.isActive));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      const [header, base64] = result.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || file.type || 'image/jpeg';
      setImagePayload({ base64, mimeType });
      sound.playFlip();
    };
    reader.readAsDataURL(file);
  };

  const handleStartScan = async (forcedText?: string) => {
    const textToProcess = forcedText || inputText;
    
    // Validate that we have either an image or text
    if (!imagePayload && !textToProcess.trim()) {
      return;
    }

    const status = await checkProStatus();
    const used = parseInt(localStorage.getItem('studybuddy_scans_used') || '0', 10);
    if (!status.isActive && used >= 3) {
      sound.playFlip();
      alert('Free tier limit reached (3/3 scans used). Unlock unlimited scans with StudyBuddy Pro!');
      navigate('/paywall');
      return;
    }

    sound.playFlip();
    setStep('scanning');

    setTimeout(async () => {
      setStep('processing');
      setStatusMessage('Distilling high-yield concepts...');
      
      try {
        let cards: Flashcard[] = [];
        if (imagePayload) {
          cards = await studyAgent.generateFlashcards(
            { imageBase64: imagePayload.base64, mimeType: imagePayload.mimeType },
            "Photo Notes " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          );
        } else {
          cards = await studyAgent.generateFlashcards(
            { text: textToProcess },
            textToProcess.slice(0, 20) + "..."
          );
        }

        if (!status.isActive) {
          const newUsed = used + 1;
          localStorage.setItem('studybuddy_scans_used', String(newUsed));
          setScansUsed(newUsed);
        }

        setGeneratedCards(cards);
        sound.playSuccess();
        setStep('success');
      } catch (e) {
        console.error(e);
        setStep('idle');
      }
    }, 1200);
  };

  const loadSample = (sample: typeof SAMPLE_NOTES[0]) => {
    setInputText(sample.text);
    setMode('paste');
    sound.playFlip();
  };

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <header style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.02em' }}>Scan & Synthesize</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <ShieldCheck size={13} color="#10b981" />
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>PII Shield Active</span>
          </div>
          <div 
            onClick={() => !isPro && navigate('/paywall')}
            style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', 
              background: isPro ? 'rgba(16, 185, 129, 0.1)' : 'rgba(217, 70, 239, 0.12)', 
              borderRadius: '1rem', 
              border: isPro ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(217, 70, 239, 0.25)',
              cursor: isPro ? 'default' : 'pointer'
            }}
          >
            <Sparkles size={12} color={isPro ? '#10b981' : 'var(--accent-secondary)'} />
            <span style={{ fontSize: '0.72rem', color: isPro ? '#10b981' : 'var(--accent-secondary)', fontWeight: 600 }}>
              {isPro ? 'Pro: Unlimited' : `Free: ${Math.max(0, 3 - scansUsed)}/3 Scans`}
            </span>
          </div>
        </div>
      </header>

      {/* Hidden file input supporting camera & gallery */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        
        {step === 'idle' && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Mode Switcher */}
            <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', padding: '4px', alignSelf: 'center' }}>
              <button 
                onClick={() => setMode('camera')}
                style={{ 
                  padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  background: mode === 'camera' ? 'var(--accent-gradient)' : 'transparent', 
                  color: mode === 'camera' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <Camera size={15} /> Photo / Upload
              </button>
              <button 
                onClick={() => setMode('paste')}
                style={{ 
                  padding: '0.5rem 1.1rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer', fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.85rem',
                  background: mode === 'paste' ? 'var(--accent-gradient)' : 'transparent', 
                  color: mode === 'paste' ? 'white' : 'var(--text-secondary)',
                  transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.4rem'
                }}
              >
                <FileText size={15} /> Paste Notes
              </button>
            </div>

            {mode === 'camera' ? (
              <div 
                className="glass-panel" 
                onClick={() => fileInputRef.current?.click()}
                style={{ 
                  width: '100%', 
                  minHeight: '230px',
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  border: '2px dashed var(--border-focus)', 
                  cursor: 'pointer', 
                  padding: '1.5rem',
                  position: 'relative',
                  overflow: 'hidden',
                  background: imagePreview ? `url(${imagePreview}) center/cover no-repeat` : 'rgba(255,255,255,0.02)'
                }}
              >
                {imagePreview && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(2px)' }} />
                )}

                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ padding: '1.25rem', background: 'rgba(139, 92, 246, 0.15)', borderRadius: '50%', boxShadow: '0 0 24px rgba(139, 92, 246, 0.25)' }}>
                    {imagePreview ? <Upload size={36} color="var(--accent-primary)" /> : <Camera size={42} color="var(--accent-primary)" />}
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                      {imagePreview ? 'Photo Selected! Tap to change' : 'Snap photo or upload handwritten notes'}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      Multimodal Gemini 1.5 reads cursive, diagrams & print
                    </p>
                    {imagePreview && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                          setImagePayload(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        style={{
                          marginTop: '0.5rem',
                          background: 'rgba(239, 68, 68, 0.15)',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          color: '#ef4444',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          fontFamily: 'Outfit, sans-serif'
                        }}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste lecture transcript, textbook summary, or class notes here...&#10;&#10;Our AI will synthesize atomic questions, answers, and mnemonics."
                  style={{
                    width: '100%', minHeight: '170px', padding: '1rem',
                    background: 'var(--bg-glass)', color: 'var(--text-primary)',
                    border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-md)',
                    fontFamily: 'Outfit, sans-serif', fontSize: '0.92rem', lineHeight: 1.6,
                    resize: 'vertical', outline: 'none'
                  }}
                />
                
                {/* 1-Tap Quick Sample Chips for Judges */}
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                    ⚡ QUICK SAMPLES (1-TAP TEST):
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {SAMPLE_NOTES.map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => loadSample(sample)}
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '1rem',
                          padding: '0.35rem 0.75rem',
                          color: 'var(--text-primary)',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontFamily: 'Outfit, sans-serif',
                          transition: 'all 0.15s'
                        }}
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} 
              onClick={() => handleStartScan()}
              disabled={mode === 'camera' ? !imagePayload : inputText.trim().length < 5}
            >
              <Sparkles size={18} />
              {mode === 'camera' && !imagePayload ? 'Choose an Image First' : 'Generate Flashcards with AI'}
            </button>
          </div>
        )}

        {/* Scanning Animation */}
        {step === 'scanning' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%', maxWidth: '320px' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '1rem', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
              <Camera size={52} color="var(--accent-primary)" />
              {/* Laser Scanning Bar */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'var(--accent-gradient)',
                boxShadow: '0 0 16px var(--accent-secondary)',
                animation: 'laserScan 1.2s ease-in-out infinite alternate'
              }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.3rem' }}>Digitizing Notes...</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Multimodal OCR deciphering handwritten patterns</p>
            </div>
          </div>
        )}

        {/* Processing State */}
        {step === 'processing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
            <Loader2 size={58} color="var(--accent-secondary)" style={{ animation: 'spin 1.8s linear infinite' }} />
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }} className="text-gradient">Pedagogical Agent at Work</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>{statusMessage}</p>
            </div>
          </div>
        )}

        {/* Success Screen */}
        {step === 'success' && (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem', width: '100%' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '50%' }}>
              <CheckCircle2 size={64} color="#10b981" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.2rem' }}>Deck Synthesized!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Created {generatedCards.length} high-yield active recall cards with mnemonics.</p>
            </div>

            {/* Generated Cards Carousel Preview */}
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
              {generatedCards.map((c, i) => (
                <div key={i} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                  <div style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent-primary)', marginRight: '0.5rem' }}>Q{i+1}:</span>
                    {c.front}
                  </div>
                  {c.tag && (
                    <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.06)', borderRadius: '1rem', marginLeft: '0.5rem' }}>
                      {c.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem', width: '100%', marginTop: '0.5rem' }}>
              <button 
                className="btn-glass" 
                style={{ flex: 1, padding: '0.85rem' }} 
                onClick={() => { setStep('idle'); setImagePreview(null); setImagePayload(null); setInputText(''); }}
              >
                <RefreshCw size={16} /> Scan Another
              </button>
              <button 
                className="btn-primary" 
                style={{ flex: 1, padding: '0.85rem' }} 
                onClick={() => navigate('/study')}
              >
                Study Now
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
      
      <style>{`
        @keyframes laserScan {
          0% { top: 0; }
          100% { top: calc(100% - 3px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
