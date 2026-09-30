import { useState } from 'react';
import { Camera, Image as ImageIcon, Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { studyAgent } from '../utils/ai-agent';

export function Scan() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'idle' | 'scanning' | 'processing' | 'success'>('idle');

  const handleScan = async () => {
    setStep('scanning');
    
    // Simulate camera shutter/scan delay
    setTimeout(async () => {
      setStep('processing');
      try {
        // Use the ECC-principled AI Agent (Scrubs PII internally)
        const mockOcrText = "Student Name: John Doe. Email: john@example.com. Notes: Mitochondria generates ATP.";
        await studyAgent.generateFlashcards(mockOcrText);
        setStep('success');
      } catch (e) {
        console.error(e);
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
            <div className="glass-panel" style={{ width: '100%', aspectRatio: '3/4', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--border-focus)', cursor: 'pointer', gap: '1rem' }} onClick={handleScan}>
              <div style={{ padding: '1.5rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '50%' }}>
                <Camera size={48} color="var(--accent-primary)" />
              </div>
              <p style={{ fontWeight: 500, fontSize: '1.1rem' }}>Tap to capture notes</p>
            </div>
            
            <button className="btn-glass" style={{ width: '100%' }}>
              <ImageIcon size={20} />
              Choose from Gallery
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
              <p style={{ color: 'var(--text-secondary)' }}>Generated 14 flashcards from your notes.</p>
            </div>
            
            <div className="glass-panel" style={{ width: '100%', padding: '1.5rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>Biology: Cell Structure</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>14 new cards added</p>
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
