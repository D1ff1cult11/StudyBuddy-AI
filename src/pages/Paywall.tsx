import { useState } from 'react';
import { Crown, CheckCircle2, Zap, ChevronLeft, Shield, Infinity, Brain } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Paywall({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = () => {
    setLoading(true);
    // Simulate RevenueCat SDK purchase flow
    setTimeout(() => {
      setLoading(false);
      if (onClose) onClose();
      else navigate('/');
    }, 1500);
  };

  const handleBack = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="animate-slide-up" style={{ 
      position: 'fixed', inset: 0, zIndex: 100, 
      background: 'var(--bg-primary)', 
      display: 'flex', flexDirection: 'column' 
    }}>
      {/* Hero */}
      <div style={{ 
        position: 'relative', height: '36vh', 
        background: 'var(--accent-gradient)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        overflow: 'hidden' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 20px 20px, white 1.5px, transparent 0)', backgroundSize: '36px 36px' }} />
        <Crown size={72} color="white" className="animate-float" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }} />
        
        {/* Back button */}
        <button 
          onClick={handleBack} 
          style={{ 
            position: 'absolute', top: '1.25rem', left: '1.25rem', 
            background: 'rgba(0,0,0,0.25)', border: 'none', color: 'white', 
            padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', 
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.15s'
          }}
        >
          <ChevronLeft size={22} />
        </button>
      </div>

      {/* Content */}
      <div style={{ 
        flex: 1, padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', 
        background: 'var(--bg-secondary)', 
        borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', 
        marginTop: '-1.5rem', zIndex: 2 
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>StudyBuddy <span className="text-gradient">Pro</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Unlock unlimited AI scans and advanced analytics.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '0.5rem' }}>
          {[
            { icon: Infinity, text: 'Unlimited AI Note Scanning' },
            { icon: Brain, text: 'Spaced Repetition Analytics' },
            { icon: Shield, text: 'Export to PDF & Notion' },
            { icon: Zap, text: 'Priority AI Processing' },
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.4rem', borderRadius: '0.5rem', 
                background: 'rgba(139, 92, 246, 0.08)'
              }}>
                <CheckCircle2 size={20} color="var(--accent-primary)" />
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 500 }}>{feature.text}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Pricing card */}
          <div className="glass-panel" style={{ 
            padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
            border: '2px solid rgba(139, 92, 246, 0.3)' 
          }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: '1.05rem' }}>Annual Plan</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 600 }}>7-Day Free Trial</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800, fontSize: '1.35rem', letterSpacing: '-0.02em' }}>$29.99</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/year</p>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '1.1rem' }} onClick={handleSubscribe}>
            {loading ? <Zap className="animate-pulse" size={20} /> : <Crown size={18} />}
            {loading ? 'Processing via RevenueCat...' : 'Start Free Trial'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Cancel anytime · Powered by RevenueCat · No commitment
          </p>
        </div>
      </div>
    </div>
  );
}
