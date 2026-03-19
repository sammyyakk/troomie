/**
 * Firestore CRUD Helper Functions
 */
import {
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { UserProfile, Swipe, Match, ChatMessage } from '../../types';

// ─── User Profile ────────────────────────────────────────────────

export const createUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await setDoc(doc(db, 'users', uid), {
    ...data,
    uid,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  return convertTimestamps(snap.data()) as UserProfile;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
  await updateDoc(doc(db, 'users', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const subscribeToUserProfile = (
  uid: string,
  callback: (user: UserProfile | null) => void
) => {
  return onSnapshot(doc(db, 'users', uid), (snap) => {
    if (snap.exists()) {
      callback(convertTimestamps(snap.data()) as UserProfile);
    } else {
      callback(null);
    }
  });
};

// ─── Potential Matches (Users to Swipe On) ───────────────────────

export const getPotentialMatches = async (
  currentUid: string,
  preferences: { ageMin: number; ageMax: number; genderPreference: string[] }
): Promise<UserProfile[]> => {
  // Get users already swiped on
  const swipedSnap = await getDocs(
    query(collection(db, 'swipes'), where('swiperId', '==', currentUid))
  );
  const swipedIds = new Set(swipedSnap.docs.map((d) => d.data().swipedId));
  swipedIds.add(currentUid); // exclude self

  // Get all verified users (in production, use geoqueries / Cloud Functions for filtering)
  const usersSnap = await getDocs(
    query(collection(db, 'users'), where('isVerified', '==', true), limit(50))
  );

  return usersSnap.docs
    .map((d) => convertTimestamps(d.data()) as UserProfile)
    .filter((u) => !swipedIds.has(u.uid))
    .filter((u) => {
      if (preferences.genderPreference.length > 0) {
        return preferences.genderPreference.includes(u.gender);
      }
      return true;
    })
    .filter((u) => u.age >= preferences.ageMin && u.age <= preferences.ageMax);
};

// ─── Swipes ──────────────────────────────────────────────────────

export const recordSwipe = async (swiperId: string, swipedId: string, direction: 'left' | 'right') => {
  await addDoc(collection(db, 'swipes'), {
    swiperId,
    swipedId,
    direction,
    createdAt: serverTimestamp(),
  });

  // Check for mutual like
  if (direction === 'right') {
    const mutualSnap = await getDocs(
      query(
        collection(db, 'swipes'),
        where('swiperId', '==', swipedId),
        where('swipedId', '==', swiperId),
        where('direction', '==', 'right')
      )
    );

    if (!mutualSnap.empty) {
      // Create match!
      return await createMatch(swiperId, swipedId);
    }
  }

  return null;
};

// ─── Matches ─────────────────────────────────────────────────────

const createMatch = async (uid1: string, uid2: string): Promise<Match> => {
  const matchRef = await addDoc(collection(db, 'matches'), {
    users: [uid1, uid2],
    createdAt: serverTimestamp(),
  });

  const matchId = matchRef.id;

  // Update the match doc with chatId = matchId (reuse the same ID for simplicity)
  await updateDoc(matchRef, { chatId: matchId });

  return {
    id: matchId,
    users: [uid1, uid2],
    chatId: matchId,
    createdAt: new Date(),
  };
};

export const getMatches = async (uid: string): Promise<Match[]> => {
  const snap = await getDocs(
    query(
      collection(db, 'matches'),
      where('users', 'array-contains', uid),
      orderBy('createdAt', 'desc')
    )
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...convertTimestamps(d.data()),
  })) as Match[];
};

export const subscribeToMatches = (
  uid: string,
  callback: (matches: Match[]) => void
) => {
  return onSnapshot(
    query(
      collection(db, 'matches'),
      where('users', 'array-contains', uid),
      orderBy('createdAt', 'desc')
    ),
    (snap) => {
      const matches = snap.docs.map((d) => ({
        id: d.id,
        ...convertTimestamps(d.data()),
      })) as Match[];
      callback(matches);
    }
  );
};

export const unmatch = async (matchId: string) => {
  await deleteDoc(doc(db, 'matches', matchId));
};

// ─── Chat Messages ───────────────────────────────────────────────

export const sendMessage = async (
  chatId: string,
  message: Omit<ChatMessage, 'id' | 'createdAt'>
) => {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    ...message,
    createdAt: serverTimestamp(),
  });

  // Update match with last message
  await updateDoc(doc(db, 'matches', chatId), {
    lastMessage: message.text || (message.mediaType === 'image' ? '📷 Photo' : '🎥 Video'),
    lastMessageAt: serverTimestamp(),
  });
};

export const subscribeToChatMessages = (
  chatId: string,
  callback: (messages: ChatMessage[]) => void
) => {
  return onSnapshot(
    query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('createdAt', 'desc'),
      limit(100)
    ),
    (snap) => {
      const messages = snap.docs.map((d) => ({
        id: d.id,
        ...convertTimestamps(d.data()),
      })) as ChatMessage[];
      callback(messages);
    }
  );
};

export const markMessagesAsRead = async (chatId: string, userId: string) => {
  const snap = await getDocs(
    query(
      collection(db, 'chats', chatId, 'messages'),
      where('read', '==', false),
      where('senderId', '!=', userId)
    )
  );

  const updates = snap.docs.map((d) => updateDoc(d.ref, { read: true }));
  await Promise.all(updates);
};

// ─── Helpers ─────────────────────────────────────────────────────

const convertTimestamps = (data: any): any => {
  if (data === null || data === undefined) return data;
  if (data instanceof Timestamp) return data.toDate();
  if (Array.isArray(data)) return data.map(convertTimestamps);
  if (typeof data === 'object') {
    const result: any = {};
    for (const key of Object.keys(data)) {
      result[key] = convertTimestamps(data[key]);
    }
    return result;
  }
  return data;
};
