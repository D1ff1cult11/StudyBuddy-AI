// ==========================================
// Supabase Realtime Arena Unit Tests
// ==========================================
// Validates realtime presence client initialization,
// graceful fallback handling, and peer state updates.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  initSupabaseRealtime,
  joinStudyRoom,
  broadcastActivity,
  isRealtimeActive,
  type PeerPresence
} from '../utils/supabase-realtime';

describe('Supabase Realtime Arena', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('handles unconfigured credentials gracefully in demo mode', () => {
    const initialized = initSupabaseRealtime();
    expect(typeof initialized).toBe('boolean');
  });

  it('isRealtimeActive returns false by default without active channel', () => {
    const active = isRealtimeActive();
    expect(active).toBe(false);
  });

  it('joinStudyRoom returns cleanup function in demo mode', () => {
    const mockProfile: PeerPresence = {
      name: 'Arjun K.',
      university: 'IIT Delhi',
      avatar: '👨‍🎓',
      status: 'Studying Electrodynamics',
      joinedAt: 'Just now',
      xp: 1420
    };

    const cleanup = joinStudyRoom(
      mockProfile,
      () => {},
      () => {}
    );

    expect(typeof cleanup).toBe('function');
    // Ensure invoking cleanup does not throw
    expect(() => cleanup()).not.toThrow();
  });

  it('broadcastActivity does not crash when unconfigured', () => {
    expect(() => broadcastActivity('Scholar', 'Mastered 10 cards in Thermodynamics')).not.toThrow();
  });
});
