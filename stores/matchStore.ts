/**
 * Match Store — Zustand
 * Manages swipe queue and confirmed matches
 */
import { create } from 'zustand';
import type { UserProfile, Match } from '../types';
import { getPotentialMatches, recordSwipe, getMatches, subscribeToMatches, unmatch, getUserProfile } from '../lib/firebase/firestore';

interface MatchState {
  potentialMatches: UserProfile[];
  confirmedMatches: Match[];
  currentIndex: number;
  isLoading: boolean;
  newMatch: Match | null; // For "It's a Match!" modal

  // Actions
  loadPotentialMatches: (uid: string, prefs: { ageMin: number; ageMax: number; genderPreference: string[] }) => Promise<void>;
  swipe: (uid: string, targetUid: string, direction: 'left' | 'right') => Promise<void>;
  subscribeMatches: (uid: string) => () => void;
  unmatchUser: (matchId: string) => Promise<void>;
  dismissMatchModal: () => void;
}

export const useMatchStore = create<MatchState>((set, get) => ({
  potentialMatches: [],
  confirmedMatches: [],
  currentIndex: 0,
  isLoading: false,
  newMatch: null,

  loadPotentialMatches: async (uid, prefs) => {
    set({ isLoading: true });
    try {
      const matches = await getPotentialMatches(uid, prefs);
      set({ potentialMatches: matches, currentIndex: 0, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  swipe: async (uid, targetUid, direction) => {
    const { currentIndex } = get();
    set({ currentIndex: currentIndex + 1 });

    const match = await recordSwipe(uid, targetUid, direction);
    if (match) {
      // Mutual like — fetch the other user's profile for the modal
      const otherUid = match.users.find((u) => u !== uid)!;
      const otherUser = await getUserProfile(otherUid);
      set({ newMatch: { ...match, otherUser: otherUser ?? undefined } });
    }
  },

  subscribeMatches: (uid) => {
    const unsubscribe = subscribeToMatches(uid, async (matches) => {
      // Enrich matches with other user profile
      const enriched = await Promise.all(
        matches.map(async (m) => {
          const otherUid = m.users.find((u) => u !== uid)!;
          const otherUser = await getUserProfile(otherUid);
          return { ...m, otherUser: otherUser ?? undefined };
        })
      );
      set({ confirmedMatches: enriched });
    });
    return unsubscribe;
  },

  unmatchUser: async (matchId) => {
    await unmatch(matchId);
    set((state) => ({
      confirmedMatches: state.confirmedMatches.filter((m) => m.id !== matchId),
    }));
  },

  dismissMatchModal: () => set({ newMatch: null }),
}));
