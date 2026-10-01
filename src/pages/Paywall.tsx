import { useState, useEffect } from 'react';
import { Crown, CheckCircle2, Zap, ChevronLeft, Shield, Infinity, Brain, RotateCcw, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { purchasePackage, restorePurchases, checkProStatus, isRealMode, setStudentAttributes } from '../utils/revenuecat';
import { sound } from '../utils/audio';

export function Paywall({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<'student' | 'annual'>('student');
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    checkProStatus().then((status) => {
      setIsPro(status.isActive);
    });
  }, []);

  const handleSubscribe = async () => {
    sound.playFlip();
    setLoading(true);
    setFeedbackMsg(null);

    try {
      await setStudentAttributes({
        country: 'India',
        age: '19',
        plan_selected: selectedPlan,
        currency_ppp: selectedPlan === 'student' ? 'INR_999' : 'USD_29.99',
        student_cohort: 'NextGen2026',
      });

      const pkg = {
        identifier: selectedPlan === 'student' ? '$rc_student_annual' : '$rc_annual',
        product: {
          identifier: selectedPlan === 'student' ? 'studybuddy_student_annual' : 'studybuddy_pro_annual',
          title: selectedPlan === 'student' ? 'Next Gen Student Pass (50% Off)' : 'StudyBuddy Pro Annual',
          price: selectedPlan === 'student' ? 14.99 : 29.99,
          currencyCode: 'USD',
        },
      };

      const success = await purchasePackage(pkg);
      if (success) {
        sound.playSuccess();
        setIsPro(true);
        setFeedbackMsg('🎉 Pro Unlocked via RevenueCat! Unlimited AI scans & SM-2 analytics active.');
        setTimeout(() => {
          if (onClose) onClose();
          else navigate('/');
        }, 1200);
      } else {
        setFeedbackMsg('Transaction was cancelled or could not be processed.');
      }
    } catch (e) {
      console.error('[Paywall] Subscribe error:', e);
      setFeedbackMsg('Error connecting to RevenueCat billing service.');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    sound.playFlip();
    setRestoring(true);
    setFeedbackMsg(null);

    try {
      const status = await restorePurchases();
      if (status.isActive) {
        sound.playSuccess();
        setIsPro(true);
        setFeedbackMsg('✅ Previous Pro subscription restored successfully!');
      } else {
        setFeedbackMsg('No active subscription found to restore.');
      }
    } catch (e) {
      console.error('[Paywall] Restore error:', e);
      setFeedbackMsg('Unable to reach restore endpoint.');
    } finally {
      setRestoring(false);
    }
  };

  const handleBack = () => {
    sound.playFlip();
    if (onClose) onClose();
    else navigate(-1);
  };

  return (
    <div className="animate-slide-up" style={{ 
      position: 'absolute', inset: 0, zIndex: 100, 
      background: 'var(--bg-primary)', 
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto'
    }}>
      {/* Hero */}
      <div style={{ 
        position: 'relative', height: '32vh', 
        background: 'var(--accent-gradient)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        overflow: 'hidden' 
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.15, backgroundImage: 'radial-gradient(circle at 20px 20px, white 1.5px, transparent 0)', backgroundSize: '36px 36px' }} />
        <Crown size={64} color="white" className="animate-float" style={{ filter: 'drop-shadow(0 12px 24px rgba(0,0,0,0.35))' }} />
        
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
        flex: 1, padding: '1.75rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.1rem', 
        background: 'var(--bg-secondary)', 
        borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', 
        marginTop: '-1.5rem', zIndex: 2 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.2rem 0.6rem', background: 'rgba(217, 70, 239, 0.12)', borderRadius: '1rem', marginBottom: '0.5rem', border: '1px solid rgba(217, 70, 239, 0.25)' }}>
            <Zap size={12} color="var(--accent-secondary)" />
            <span style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
              REVENUECAT {isRealMode() ? 'LIVE' : 'SANDBOX'} ENGINE
            </span>
          </div>
          <h2 style={{ fontSize: '1.65rem', marginBottom: '0.3rem', letterSpacing: '-0.02em' }}>StudyBuddy <span className="text-gradient">Pro</span></h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            Empowering students worldwide with science-backed retention.
          </p>
        </div>

        {feedbackMsg && (
          <div style={{ 
            padding: '0.75rem 1rem', 
            borderRadius: '0.75rem', 
            background: feedbackMsg.includes('🎉') || feedbackMsg.includes('✅') ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', 
            border: `1px solid ${feedbackMsg.includes('🎉') || feedbackMsg.includes('✅') ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
            fontSize: '0.85rem',
            textAlign: 'center',
            color: 'var(--text-primary)'
          }}>
            {feedbackMsg}
          </div>
        )}

        {/* Value Prop List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
          {[
            { icon: Infinity, text: 'Unlimited Gemini Flash multimodal OCR note scans' },
            { icon: Brain, text: 'Full SuperMemo SM-2 memory retention engine' },
            { icon: Shield, text: 'Client-side PII scrubbing before any cloud AI call' },
            { icon: GraduationCap, text: 'LMS Canvas & Blackboard two-way sync' },
          ].map((feature, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ 
                padding: '0.4rem', borderRadius: '0.5rem', 
                background: 'rgba(139, 92, 246, 0.12)'
              }}>
                <CheckCircle2 size={18} color="var(--accent-primary)" />
              </div>
              <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{feature.text}</span>
            </div>
          ))}
        </div>

        {/* Pricing Selection */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          
          {/* Plan 1: Next Gen Student Tier */}
          <div 
            onClick={() => { setSelectedPlan('student'); sound.playFlip(); }}
            className="glass-panel" 
            style={{ 
              padding: '0.9rem 1.15rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              border: selectedPlan === 'student' ? '2px solid var(--accent-secondary)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedPlan === 'student' ? 'rgba(217, 70, 239, 0.08)' : 'var(--bg-glass)',
              transition: 'all 0.15s'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Next Gen Student Pass</span>
                <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem', borderRadius: '1rem', background: 'var(--accent-secondary)', color: 'white', fontWeight: 800 }}>50% OFF</span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 600, marginTop: '0.15rem' }}>
                For students (19yo, undergrads, India & Global PPP)
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>$14.99</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>/year (or ₹999)</p>
            </div>
          </div>

          {/* Plan 2: Standard Annual Pro */}
          <div 
            onClick={() => { setSelectedPlan('annual'); sound.playFlip(); }}
            className="glass-panel" 
            style={{ 
              padding: '0.9rem 1.15rem', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              cursor: 'pointer',
              border: selectedPlan === 'annual' ? '2px solid var(--accent-primary)' : '1px solid rgba(255, 255, 255, 0.08)',
              background: selectedPlan === 'annual' ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-glass)',
              transition: 'all 0.15s'
            }}
          >
            <div>
              <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>Standard Pro Annual</p>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600, marginTop: '0.15rem' }}>
                7-Day Free Trial included
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>$29.99</p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>/year</p>
            </div>
          </div>
        </div>

        {/* Free vs Pro Comparison Toggle */}
        <div style={{ textAlign: 'center', marginTop: '0.2rem' }}>
          <button
            onClick={() => { setShowComparison(prev => !prev); sound.playFlip(); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--accent-primary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '0.3rem'
            }}
          >
            {showComparison ? 'Hide Plan Comparison' : 'Compare Free vs. Pro Features'}
          </button>
        </div>

        {showComparison && (
          <div className="glass-panel animate-slide-up" style={{ padding: '0.85rem 1rem', fontSize: '0.78rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '0.4rem 0.2rem' }}>Feature</th>
                  <th style={{ padding: '0.4rem 0.2rem', textAlign: 'center' }}>Free</th>
                  <th style={{ padding: '0.4rem 0.2rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>Pro Pass</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'AI Note Scans', free: '3 Scans', pro: 'Unlimited' },
                  { name: 'Gemini Voice Tutor', free: 'Disabled', pro: 'Conversational' },
                  { name: 'SM-2 Memory Scheduling', free: 'Standard', pro: 'Dynamic Ease Factor' },
                  { name: 'Canvas & Blackboard Sync', free: '1 Module', pro: 'Unlimited Two-Way' },
                  { name: 'Collaborative Arena', free: 'Solo', pro: 'Live Peer Match' },
                  { name: 'Client-side PII Scrubbing', free: 'Included', pro: 'Included' },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '0.45rem 0.2rem', color: 'var(--text-primary)', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '0.45rem 0.2rem', textAlign: 'center', color: 'var(--text-muted)' }}>{row.free}</td>
                    <td style={{ padding: '0.45rem 0.2rem', textAlign: 'center', color: 'var(--accent-primary)', fontWeight: 700 }}>{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* CTA Button */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          <button 
            className="btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1rem' }} 
            onClick={handleSubscribe}
            disabled={loading || restoring}
          >
            {loading ? <Zap className="animate-pulse" size={18} /> : <Crown size={18} />}
            {loading ? 'Routing to RevenueCat SDK...' : (isPro ? 'Pro Active (Renew / Switch)' : 'Start 7-Day Free Trial')}
          </button>

          {/* Restore Purchases */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <button 
              onClick={handleRestore}
              disabled={restoring || loading}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--text-secondary)', 
                fontSize: '0.78rem', 
                cursor: 'pointer', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.3rem',
                textDecoration: 'underline'
              }}
            >
              <RotateCcw size={12} />
              {restoring ? 'Verifying with RevenueCat...' : 'Restore Purchases'}
            </button>
          </div>
          
          <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
            Entitlement: pro · Powered by @revenuecat/purchases-js · Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
}
