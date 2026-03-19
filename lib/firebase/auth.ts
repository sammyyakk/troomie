/**
 * Firebase Auth Helper Functions
 */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';

export const firebaseSignUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
};

export const firebaseSignIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const firebaseSignOut = async () => {
  await signOut(auth);
};

export const firebaseResetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const firebaseResendVerification = async () => {
  if (auth.currentUser) {
    await sendEmailVerification(auth.currentUser);
  }
};

export const subscribeToAuth = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const getCurrentUser = () => auth.currentUser;

export const isEmailVerified = () => auth.currentUser?.emailVerified ?? false;
