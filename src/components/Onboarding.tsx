import { useState } from 'react';
import { Sparkles, Brain, Shield, ArrowRight, Zap } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Sparkles,
    iconColor: '#8b5cf6',
    title: 'Scan. Learn. Master.',
    subtitle: 'Turn messy handwritten notes into AI-powered flashcards in seconds.',
    gradient: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(217,70,239,0.1))',
  },
  {
    icon: Brain,
    iconColor: '#d946ef',
    title: 'Spaced Repetition',
    subtitle: 'Our SM-2 algorithm schedules reviews at the perfect time so you never forget.',
    gradient: 'linear-gradient(135deg, rgba(217,70,239,0.15), rgba(236,72,153,0.1))',
  },
  {
    icon: Shield,
    iconColor: '#10b981',
    title: 'Privacy First',
    subtitle: 'PII is automatically scrubbed before any data reaches our AI. Your notes stay yours.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(20,184,166,0.1))',
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [current, setCurrent] = useState(0);
  const slide = slides[current];
  const Icon = slide.icon;
  const isLast = current === slides.length - 1;

  const handleNext = () => {
    if (isLast) {
      localStorage.setItem('onboarding_complete', 'true');
      onComplete();
    } else {
      setCurrent(c => c + 1);
    }
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '2rem',
    }}>
      {/* Animated Icon */}
      <div
        className="animate-slide-up"
        key={current}
        style={{
          width: '140px', height: '140px', borderRadius: '50%',
          background: slide.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '2.5rem',
          boxShadow: `0 0 60px ${slide.iconColor}33`,
        }}
      >
        <Icon size={56} color={slide.iconColor} className="animate-float" />
      </div>

      {/* Content */}
      <div className="animate-slide-up" key={`text-${current}`} style={{ textAlign: 'center', maxWidth: '320px' }}>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          {slide.title}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7 }}>
          {slide.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '8px', marginTop: '3rem', marginBottom: '2rem' }}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              background: i === current ? 'var(--accent-gradient)' : 'rgba(255,255,255,0.1)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        ))}
      </div>

      {/* CTA */}
      <button className="btn-primary" onClick={handleNext} style={{ width: '100%', maxWidth: '320px', padding: '1rem' }}>
        {isLast ? (
          <>
            <Zap size={18} />
            Get Started
          </>
        ) : (
          <>
            Continue
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* Skip */}
      {!isLast && (
        <button
          onClick={() => { localStorage.setItem('onboarding_complete', 'true'); onComplete(); }}
          style={{
            marginTop: '1rem', background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontFamily: 'Outfit, sans-serif', fontSize: '0.85rem',
          }}
        >
          Skip
        </button>
      )}
    </div>
  );
}
