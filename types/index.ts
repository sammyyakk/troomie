/**
 * Troomie — TypeScript Type Definitions
 */

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  dateOfBirth: Date;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  avatarUrl: string;
  photos: string[];
  city: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  about: string;
  occupation: string;
  education: string;
  preferences: UserPreferences;
  housing: HousingInfo;
  lifestyle: LifestylePrefs;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface UserPreferences {
  ageRange: { min: number; max: number };
  genderPreference: string[];
  maxDistance: number;
}

export interface HousingInfo {
  hasProperty: boolean;
  propertyDetails?: PropertyDetails;
}

export interface PropertyDetails {
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  rent: number;
  photos: string[];
}

export interface LifestylePrefs {
  cleanliness: 1 | 2 | 3 | 4 | 5;
  sleepSchedule: 'early' | 'normal' | 'late';
  smoking: boolean;
  pets: boolean;
  guests: 'rarely' | 'sometimes' | 'often';
  noise: 'quiet' | 'moderate' | 'loud';
}

export interface Swipe {
  id: string;
  swiperId: string;
  swipedId: string;
  direction: 'left' | 'right';
  createdAt: Date;
}

export interface Match {
  id: string;
  users: [string, string];
  chatId: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
  otherUser?: UserProfile;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  read: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  matchId: string;
  otherUser: UserProfile;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
}

// Sign-up multi-step form types
export interface SignUpStep1Data {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpStep2Data {
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'non-binary' | 'other';
}

export interface SignUpStep3Data {
  city: string;
  avatarUri?: string;
}

export interface SignUpStep4Data {
  about: string;
  occupation: string;
  education: string;
}

export interface SignUpStep5Data {
  hasProperty: boolean;
  propertyDetails?: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    rent: number;
  };
}

export interface SignUpStep6Data {
  cleanliness: 1 | 2 | 3 | 4 | 5;
  sleepSchedule: 'early' | 'normal' | 'late';
  smoking: boolean;
  pets: boolean;
  guests: 'rarely' | 'sometimes' | 'often';
  noise: 'quiet' | 'moderate' | 'loud';
}

export type SignUpFormData = SignUpStep1Data &
  SignUpStep2Data &
  SignUpStep3Data &
  SignUpStep4Data &
  SignUpStep5Data &
  SignUpStep6Data;
