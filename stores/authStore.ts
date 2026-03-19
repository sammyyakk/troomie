/**
 * Auth Store — Zustand
 * Manages user authentication state and profile data
 */
import { create } from 'zustand';
import type { UserProfile, SignUpFormData } from '../types';
import { subscribeToAuth, firebaseSignIn, firebaseSignUp, firebaseSignOut, firebaseResetPassword, firebaseResendVerification, isEmailVerified } from '../lib/firebase/auth';
import { createUserProfile, getUserProfile, updateUserProfile } from '../lib/firebase/firestore';
import { uploadAvatar } from '../lib/firebase/storage';

interface AuthState {
  user: UserProfile | null;
  firebaseUser: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  error: string | null;

  // Actions
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpFormData) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  checkVerification: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  uploadAndSetAvatar: (uri: string) => Promise<string>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: true,
  isAuthenticated: false,
  isEmailVerified: false,
  error: null,

  initialize: () => {
    const unsubscribe = subscribeToAuth(async (fbUser) => {
      if (fbUser) {
        try {
          const profile = await getUserProfile(fbUser.uid);
          set({
            firebaseUser: fbUser,
            user: profile,
            isAuthenticated: true,
            isEmailVerified: fbUser.emailVerified,
            isLoading: false,
          });
        } catch {
          set({
            firebaseUser: fbUser,
            isAuthenticated: true,
            isEmailVerified: fbUser.emailVerified,
            isLoading: false,
          });
        }
      } else {
        set({
          user: null,
          firebaseUser: null,
          isAuthenticated: false,
          isEmailVerified: false,
          isLoading: false,
        });
      }
    });
    return unsubscribe;
  },

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      await firebaseSignIn(email, password);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signUp: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const fbUser = await firebaseSignUp(data.email, data.password);

      // Calculate age
      const today = new Date();
      const birth = new Date(data.dateOfBirth);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      // Upload avatar if provided
      let avatarUrl = '';
      if (data.avatarUri) {
        avatarUrl = await uploadAvatar(fbUser.uid, data.avatarUri);
      }

      // Create user profile in Firestore
      await createUserProfile(fbUser.uid, {
        name: data.name,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        age,
        gender: data.gender,
        avatarUrl,
        photos: [],
        city: data.city,
        about: data.about,
        occupation: data.occupation,
        education: data.education,
        preferences: {
          ageRange: { min: 18, max: 40 },
          genderPreference: [],
          maxDistance: 50,
        },
        housing: {
          hasProperty: data.hasProperty,
          propertyDetails: data.propertyDetails
            ? { ...data.propertyDetails, photos: [] }
            : undefined,
        },
        lifestyle: {
          cleanliness: data.cleanliness,
          sleepSchedule: data.sleepSchedule,
          smoking: data.smoking,
          pets: data.pets,
          guests: data.guests,
          noise: data.noise,
        },
        isVerified: false,
      });

      set({ isLoading: false });
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    await firebaseSignOut();
    set({ user: null, firebaseUser: null, isAuthenticated: false, isLoading: false });
  },

  resetPassword: async (email) => {
    set({ error: null });
    try {
      await firebaseResetPassword(email);
    } catch (err: any) {
      const message = getAuthErrorMessage(err.code);
      set({ error: message });
      throw new Error(message);
    }
  },

  resendVerification: async () => {
    await firebaseResendVerification();
  },

  checkVerification: async () => {
    const { firebaseUser } = get();
    if (firebaseUser) {
      await firebaseUser.reload();
      const verified = firebaseUser.emailVerified;
      set({ isEmailVerified: verified });
      return verified;
    }
    return false;
  },

  updateProfile: async (data) => {
    const { user } = get();
    if (!user) return;
    await updateUserProfile(user.uid, data);
    set({ user: { ...user, ...data } });
  },

  uploadAndSetAvatar: async (uri) => {
    const { user } = get();
    if (!user) throw new Error('Not authenticated');
    const url = await uploadAvatar(user.uid, uri);
    await updateUserProfile(user.uid, { avatarUrl: url });
    set({ user: { ...user, avatarUrl: url } });
    return url;
  },

  clearError: () => set({ error: null }),
}));

function getAuthErrorMessage(code: string): string {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Try logging in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
}
