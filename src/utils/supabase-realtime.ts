// ==========================================
// Supabase Realtime Study Arena
// ==========================================
// Uses Supabase Presence for real-time peer
// tracking in collaborative study rooms.
// Free tier: 200 concurrent connections, 2M msgs/mo.

import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

export interface PeerPresence {
  name: string;
  university: string;
  avatar: string;
  status: string;
  joinedAt: string;
  xp: number;
}

export interface ArenaEvent {
  type: 'join' | 'leave' | 'activity';
  peerName: string;
  message: string;
  timestamp: number;
}

let supabase: ReturnType<typeof createClient> | null = null;
let channel: RealtimeChannel | null = null;
let configured = false;

const ROOM_NAME = 'study-arena-global';

/**
 * Initialize Supabase client for realtime features.
 */
export function initSupabaseRealtime(): boolean {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !key || url === 'your_supabase_url' || key === 'your_supabase_anon_key') {
    console.warn('[Supabase] No credentials found. Running Arena in demo mode.');
    return false;
  }

  try {
    supabase = createClient(url, key);
    configured = true;
    console.log('[Supabase] Client initialized for realtime');
    return true;
  } catch (e) {
    console.error('[Supabase] Initialization failed:', e);
    return false;
  }
}

/**
 * Join the global study room and track presence.
 * Returns cleanup function.
 */
export function joinStudyRoom(
  userProfile: PeerPresence,
  onPeersUpdate: (peers: PeerPresence[]) => void,
  onEvent: (event: ArenaEvent) => void
): () => void {
  if (!configured || !supabase) {
    // Demo mode — return no-op cleanup
    return () => {};
  }

  channel = supabase.channel(ROOM_NAME, {
    config: {
      presence: {
        key: `user_${Date.now()}`,
      },
    },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel!.presenceState<PeerPresence>();
      const peers: PeerPresence[] = [];
      Object.values(state).forEach(presences => {
        presences.forEach(p => peers.push(p as unknown as PeerPresence));
      });
      onPeersUpdate(peers);
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      const joined = newPresences[0] as unknown as PeerPresence;
      if (joined?.name) {
        onEvent({
          type: 'join',
          peerName: joined.name,
          message: `${joined.name} (${joined.university}) joined the study room!`,
          timestamp: Date.now(),
        });
      }
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      const left = leftPresences[0] as unknown as PeerPresence;
      if (left?.name) {
        onEvent({
          type: 'leave',
          peerName: left.name,
          message: `${left.name} left the room`,
          timestamp: Date.now(),
        });
      }
    })
    .on('broadcast', { event: 'activity' }, ({ payload }) => {
      onEvent({
        type: 'activity',
        peerName: payload.peerName,
        message: payload.message,
        timestamp: Date.now(),
      });
    })
    .subscribe(async (status) => {
      if (status !== 'SUBSCRIBED') return;
      await channel!.track(userProfile);
    });

  // Return cleanup
  return () => {
    if (channel) {
      channel.untrack();
      supabase?.removeChannel(channel);
      channel = null;
    }
  };
}

/**
 * Broadcast an activity event to all peers in the room.
 */
export function broadcastActivity(peerName: string, message: string): void {
  if (!channel) return;
  channel.send({
    type: 'broadcast',
    event: 'activity',
    payload: { peerName, message },
  });
}

/**
 * Update own presence status (e.g., "Reviewing Biology", "In Quiz Mode").
 */
export async function updateStatus(status: string): Promise<void> {
  if (!channel) return;
  await channel.track({ status });
}

/**
 * Check if Supabase realtime is running in real mode.
 */
export function isRealtimeActive(): boolean {
  return configured && channel !== null;
}
