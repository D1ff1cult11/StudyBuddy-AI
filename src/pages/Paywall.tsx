import { useState } from 'react';
import { Crown, CheckCircle2, Zap, X } from 'lucide-react';
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

  return (
    <div className="animate-slide-up" style={{ 
      position: 'fixed', inset: 0, zIndex: 100, 
      background: 'var(--bg-primary)', 
      display: 'flex', flexDirection: 'column' 
    }}>
      <div style={{ position: 'relative', height: '40vh', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.2, backgroundImage: 'radial-gradient(circle at 20px 20px, white 2px, transparent 0)', backgroundSize: '40px 40px' }} />
        <Crown size={80} color="white" className="animate-float" style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))' }} />
        {onClose && (
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(0,0,0,0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', backdropFilter: 'blur(4px)' }}>
            <X size={24} />
          </button>
        )}
      </div>

      <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', background: 'var(--bg-secondary)', borderTopLeftRadius: '2rem', borderTopRightRadius: '2rem', marginTop: '-2rem', zIndex: 2 }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>StudyBuddy <span className="text-gradient">Pro</span></h2>
          <p style={{ color: 'var(--text-secondary)' }}>Unlock unlimited AI scans and advanced analytics.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {[
            'Unlimited AI Note Scanning',
            'Spaced Repetition Analytics',
            'Export to PDF & Notion',
            'Priority AI Processing'
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle2 size={24} color="var(--accent-primary)" />
              <span style={{ fontSize: '1.1rem', fontWeight: 500 }}>{feature}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '2px solid var(--accent-secondary)' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>Annual Plan</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--accent-primary)' }}>1 Week Free Trial</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 700, fontSize: '1.25rem' }}>$29.99</p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>/year</p>
            </div>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: '1.25rem' }} onClick={handleSubscribe}>
            {loading ? <Zap className="animate-pulse" /> : <Crown size={20} />}
            {loading ? 'Processing via RevenueCat...' : 'Start Free Trial'}
          </button>
          
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Cancel anytime. Powered by RevenueCat.
          </p>
        </div>
      </div>
    </div>
  );
}
