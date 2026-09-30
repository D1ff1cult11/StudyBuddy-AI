import { useState, useEffect } from 'react';
import { Users, Flame, Play, Pause, RotateCcw, Swords, Sparkles, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { sound } from '../utils/audio';
import { launchConfetti } from '../utils/confetti';

interface LeaderboardUser {
  rank: number;
  name: string;
  university: string;
  xp: number;
  streak: number;
  avatar: string;
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardUser[] = [
  { rank: 1, name: "Sarah Chen", university: "MIT", xp: 3420, streak: 32, avatar: "👩‍🔬" },
  { rank: 2, name: "Marcus Vance", university: "Stanford", xp: 3150, streak: 28, avatar: "👨‍💻" },
  { rank: 3, name: "Priya Sharma", university: "IIT Bombay", xp: 2980, streak: 24, avatar: "👩‍🎓" },
  { rank: 4, name: "You (Scholar)", university: "University", xp: 2480, streak: 14, avatar: "⚡", isCurrentUser: true },
  { rank: 5, name: "Lucas Meyer", university: "Oxford", xp: 2340, streak: 19, avatar: "🏛️" },
  { rank: 6, name: "Aoi Tanaka", university: "Tokyo Tech", xp: 2190, streak: 16, avatar: "🌸" },
];

const PEERS_IN_ROOM = [
  { name: "Elena R.", school: "UC Berkeley", status: "Reviewing Bioenergetics", avatar: "🧬" },
  { name: "David K.", school: "Harvard", status: "Memorizing Algorithms", avatar: "💻" },
  { name: "Amina Z.", school: "Cambridge", status: "Doing Quiz Mode", avatar: "📖" },
  { name: "Kai Chen", school: "NUS", status: "Focusing (22m)", avatar: "🎯" },
];

export function Arena() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'room' | 'leaderboard'>('room');
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);
  const [recentEvent, setRecentEvent] = useState("Elena R. (UC Berkeley) just mastered 4 cards!");

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(s => s - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  // Periodic random peer activity ticker for lively multiplayer feel
  useEffect(() => {
    const events = [
      "David K. (Harvard) just scored 100% on Algorithms Quiz!",
      "Elena R. (UC Berkeley) started a 4-card review sprint",
      "Amina Z. (Cambridge) extended her study streak to 21 days!",
      "Kai Chen (NUS) exported biology deck to Anki"
    ];
    const ticker = setInterval(() => {
      const randomEvent = events[Math.floor(Math.random() * events.length)];
      setRecentEvent(randomEvent);
    }, 6000);
    return () => clearInterval(ticker);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleDuelClick = () => {
    sound.playSuccess();
    launchConfetti();
    navigate('/quiz');
  };

  return (
    <div className="animate-slide-up" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', letterSpacing: '-0.02em', marginBottom: '0.15rem' }}>Study Arena</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Collaborative focus rooms & campus rankings</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-glass)', borderRadius: 'var(--radius-full)', padding: '3px' }}>
          <button
            onClick={() => { setTab('room'); sound.playFlip(); }}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem',
              background: tab === 'room' ? 'var(--accent-gradient)' : 'transparent',
              color: tab === 'room' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Room
          </button>
          <button
            onClick={() => { setTab('leaderboard'); sound.playFlip(); }}
            style={{
              padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: 'none', cursor: 'pointer',
              fontFamily: 'Outfit, sans-serif', fontWeight: 600, fontSize: '0.8rem',
              background: tab === 'leaderboard' ? 'var(--accent-gradient)' : 'transparent',
              color: tab === 'leaderboard' ? 'white' : 'var(--text-secondary)'
            }}
          >
            Ranks
          </button>
        </div>
      </header>

      {tab === 'room' ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto' }}>
          {/* Synchronized Pomodoro Room */}
          <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.2rem 0.6rem', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '1rem', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '0.75rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse-glow 1.5s infinite' }} />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>SYNCHRONIZED FOCUS SPRINT</span>
            </div>

            <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-0.04em', margin: '0.2rem 0' }}>
              {formatTime(timerSeconds)}
            </h1>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              4 peers studying alongside you right now
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
              <button
                className="btn-glass"
                onClick={() => { setIsTimerRunning(!isTimerRunning); sound.playFlip(); }}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.85rem' }}
              >
                {isTimerRunning ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
              </button>
              <button
                className="btn-glass"
                onClick={() => { setTimerSeconds(25 * 60); sound.playFlip(); }}
                style={{ padding: '0.5rem 0.85rem' }}
                title="Reset timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>
          </div>

          {/* Live Activity Ticker */}
          <div style={{ background: 'rgba(217, 70, 239, 0.08)', border: '1px solid rgba(217, 70, 239, 0.2)', borderRadius: '0.75rem', padding: '0.55rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={16} color="var(--accent-secondary)" style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '0.76rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {recentEvent}
            </span>
          </div>

          {/* Peers in Room List */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Users size={16} color="var(--accent-primary)" />
              Active in Room
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PEERS_IN_ROOM.map((peer, i) => (
                <div key={i} className="glass-panel" style={{ padding: '0.75rem 0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                      {peer.avatar}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>{peer.name}</span>
                        <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: 'rgba(255,255,255,0.06)', borderRadius: '0.5rem', color: 'var(--text-muted)' }}>
                          {peer.school}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{peer.status}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleDuelClick}
                    style={{
                      background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '0.5rem', padding: '0.35rem 0.65rem', color: 'var(--accent-primary)',
                      fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem',
                      fontFamily: 'Outfit, sans-serif'
                    }}
                  >
                    <Swords size={12} /> Duel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
          {/* User Rank Card */}
          <div className="glass-panel" style={{ padding: '1rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(217, 70, 239, 0.12))', border: '1px solid rgba(217, 70, 239, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', boxShadow: '0 0 16px rgba(217, 70, 239, 0.4)' }}>
                ⚡
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Your Standing</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Rank #4 Globally</h4>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f97316', fontWeight: 700, fontSize: '0.88rem' }}>
                <Flame size={16} /> 1.5x XP
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>14-Day Streak Bonus</span>
            </div>
          </div>

          {/* Full Ranked List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {LEADERBOARD_DATA.map((user) => (
              <div
                key={user.rank}
                className="glass-panel"
                style={{
                  padding: '0.75rem 0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  border: user.isCurrentUser ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.06)',
                  background: user.isCurrentUser ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-glass)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{
                    width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 800,
                    color: user.rank === 1 ? '#fbbf24' : user.rank === 2 ? '#cbd5e1' : user.rank === 3 ? '#b45309' : 'var(--text-secondary)'
                  }}>
                    {user.rank <= 3 ? (user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : '🥉') : `#${user.rank}`}
                  </span>

                  <span style={{ fontSize: '1.2rem' }}>{user.avatar}</span>

                  <div>
                    <h5 style={{ fontSize: '0.88rem', fontWeight: 600, color: user.isCurrentUser ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                      {user.name}
                    </h5>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <GraduationCap size={12} color="var(--text-muted)" />
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{user.university}</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {user.xp.toLocaleString()} <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)' }}>XP</span>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', justifyContent: 'flex-end', fontSize: '0.7rem', color: '#f97316' }}>
                    <Flame size={12} /> {user.streak}d
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
