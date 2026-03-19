/**
 * Firebase Configuration
 *
 * Replace the placeholder values below with your actual Firebase project config.
 * You can find these in Firebase Console > Project Settings > General > Your apps.
 */
import { initializeApp, getApps } from 'firebase/app';
// @ts-ignore — React Native persistence helper
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

// Initialize Firebase (prevent re-initialization in dev hot reloading)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Auth with AsyncStorage persistence for React Native
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore database
export const db = getFirestore(app);

// Storage for images/media
export const storage = getStorage(app);

export default app;
