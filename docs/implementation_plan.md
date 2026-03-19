# Troomie — Full React Native Rebuild

Rebuild the Troomie roommate-finder app (originally iOS-only Swift/SwiftUI + Firebase) as a **cross-platform React Native app** targeting both Android and iOS with a modern, production-ready tech stack.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | **Expo SDK 52 (managed workflow)** | Fastest path to both stores; OTA updates; EAS Build handles native compilation |
| **Language** | **TypeScript** | Type safety across the entire codebase |
| **Navigation** | **Expo Router (file-based)** | Convention-over-configuration routing, deep-link support out of the box |
| **State Mgmt** | **Zustand** | Lightweight, no boilerplate, works great with React Native |
| **Backend** | **Firebase v10** (Auth, Firestore, Storage, Cloud Functions) | Real-time sync, auth, hosting — same as original, but using the modular JS SDK |
| **Styling** | **NativeWind v4** (Tailwind for RN) | Utility-first styling that compiles to native; fast iteration |
| **Animations** | **React Native Reanimated 3 + Moti** | 60fps native animations for swiping, transitions, micro-interactions |
| **Swiping** | **react-native-deck-swiper** or custom Reanimated gesture handler | Core matching UX |
| **Forms** | **React Hook Form + Zod** | Validation for sign-up, profile edit |
| **Chat** | **react-native-gifted-chat** + Firestore real-time listeners | Proven chat UI with media support |
| **Image Picker** | **expo-image-picker** | Camera + gallery access |
| **Push Notifs** | **expo-notifications + FCM** | Cross-platform push |
| **Build/Deploy** | **EAS Build + EAS Submit** | CI/CD to App Store & Play Store |

---

## User Review Required

> [!IMPORTANT]
> **Firebase project**: Do you already have a Firebase project set up, or should I create the configuration from scratch with placeholder values?

> [!IMPORTANT]
> **Matching algorithm**: The original doc describes location + age/gender preferences. Do you want a more sophisticated matching system (e.g., compatibility scoring based on hobbies/cleanliness/lifestyle) or keep it simple to start?

> [!IMPORTANT]
> **Monetization / Premium features**: Any plans for paid tiers (e.g., unlimited swipes, boost profile, see who liked you)? This would affect the data model.

> [!IMPORTANT]
> **Scope for v1**: Should we build the entire feature set described in the report for this first version, or would you like to prioritize a subset (e.g., auth + profiles + matching first, then messaging)?

---

## App Architecture

```
troomie/
├── app/                        # Expo Router (file-based routing)
│   ├── (auth)/                 # Auth stack (unauthenticated)
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   ├── forgot-password.tsx
│   │   └── verify-email.tsx
│   ├── (tabs)/                 # Main tab navigator (authenticated)
│   │   ├── _layout.tsx         # Tab bar config
│   │   ├── matching/
│   │   │   ├── index.tsx       # Swipe screen
│   │   │   └── [id].tsx        # Expanded card / property detail
│   │   ├── likes/
│   │   │   └── index.tsx       # Confirmed matches
│   │   ├── messages/
│   │   │   ├── index.tsx       # Conversations list
│   │   │   └── [chatId].tsx    # Individual chat
│   │   └── profile/
│   │       ├── index.tsx       # View profile
│   │       └── edit.tsx        # Edit profile
│   └── _layout.tsx             # Root layout (auth gate)
├── components/                 # Reusable UI components
│   ├── ui/                     # Primitives (Button, Input, Card, Avatar…)
│   ├── matching/               # SwipeCard, CardStack, MatchModal
│   ├── chat/                   # ChatBubble, MessageInput, MediaPreview
│   └── profile/                # ProfileHeader, PreferenceSlider
├── lib/                        # Services & utilities
│   ├── firebase/
│   │   ├── config.ts           # Firebase init
│   │   ├── auth.ts             # Auth helpers
│   │   ├── firestore.ts        # Firestore CRUD helpers
│   │   └── storage.ts          # Image upload helpers
│   ├── hooks/                  # Custom hooks (useAuth, useMatches, useChat…)
│   └── utils/                  # Helpers (date formatting, validation schemas)
├── stores/                     # Zustand stores
│   ├── authStore.ts
│   ├── matchStore.ts
│   └── chatStore.ts
├── constants/                  # Theme colors, sizing, config
│   └── theme.ts
├── assets/                     # Images, fonts, splash
└── types/                      # TypeScript interfaces
    └── index.ts
```

---

## Data Models (Firestore)

### `users/{uid}`
```typescript
interface User {
  uid: string;
  name: string;
  email: string;
  dateOfBirth: Timestamp;
  gender: 'male' | 'female' | 'non-binary' | 'other';
  avatarUrl: string;
  photos: string[];              // up to 6 profile photos
  city: string;
  location: GeoPoint;            // for proximity search
  about: string;                 // freeform bio
  occupation: string;
  education: string;
  preferences: {
    ageRange: { min: number; max: number };
    genderPreference: string[];
    maxDistance: number;           // in miles/km
  };
  housing: {
    hasProperty: boolean;          // looking for roommate vs looking for room
    propertyDetails?: {
      address: string;
      bedrooms: number;
      bathrooms: number;
      sqft: number;
      rent: number;               // monthly
      photos: string[];
    };
  };
  lifestyle: {
    cleanliness: 1 | 2 | 3 | 4 | 5;
    sleepSchedule: 'early' | 'normal' | 'late';
    smoking: boolean;
    pets: boolean;
    guests: 'rarely' | 'sometimes' | 'often';
    noise: 'quiet' | 'moderate' | 'loud';
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isVerified: boolean;
}
```

### `swipes/{uniqueId}`
```typescript
interface Swipe {
  swiperId: string;
  swipedId: string;
  direction: 'left' | 'right';
  createdAt: Timestamp;
}
```

### `matches/{matchId}`
```typescript
interface Match {
  users: [string, string];        // both UIDs
  chatId: string;                 // auto-created chat ref
  createdAt: Timestamp;
  lastMessage?: string;
  lastMessageAt?: Timestamp;
}
```

### `chats/{chatId}/messages/{messageId}`
```typescript
interface Message {
  senderId: string;
  text?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  read: boolean;
  createdAt: Timestamp;
}
```

---

## Screen-by-Screen Design Plan

### 1. Login Screen
- Email + password fields with validation
- "Login" button → Firebase `signInWithEmailAndPassword`
- "Forgot Password?" → navigates to forgot-password screen
- "Sign Up" link → navigates to sign-up flow
- Auto-login via `onAuthStateChanged` listener (persisted sessions)
- Error handling: invalid credentials toast

### 2. Sign-Up Screen (Multi-Step)
- **Step 1**: Name, Email, Password, Confirm Password
- **Step 2**: Date of Birth (date picker), Gender (selector)
- **Step 3**: City, Upload Avatar
- **Step 4**: About section, Occupation, Education
- **Step 5**: Housing status — "I have a place" vs "Looking for a place"
  - If has a place → property details form (bedrooms, bathrooms, sqft, rent, photos)
- **Step 6**: Lifestyle preferences (cleanliness, sleep schedule, smoking, pets, guests, noise)
- Validation via Zod schemas at each step
- On completion → `createUserWithEmailAndPassword` + `sendEmailVerification` + write user doc to Firestore
- Navigate to email verification screen

### 3. Forgot Password Screen
- Email input → `sendPasswordResetEmail`
- Success toast → navigate back to login

### 4. Email Verification Gate
- Show "Check your email" message
- Polling/button to re-check `emailVerified` status
- Resend verification button
- Once verified → navigate to main app

### 5. Matching Screen (Home / Swipe)
- Stacked card system using gesture handlers (Reanimated)
- Each card shows:
  - **Front**: Property hero photo, location, rent, bed/bath count, tenant avatar + name + age
  - **Back** (tap to flip or expand): Full about section, lifestyle tags, all photos gallery
- Swipe right = like, swipe left = pass
- Like/pass buttons at the bottom as alternative to swiping
- On mutual like → "It's a Match!" modal with confetti animation
- Empty state: "Searching for roommates in your area…" illustration
- Fetch users filtered by preferences (age range, gender, distance)

### 6. Property Detail Screen
- Full-screen photo carousel
- Property details (address, sqft, rent, bedrooms, bathrooms)
- Tenant profiles (avatar, name, age, bio, occupation)
- Lifestyle compatibility indicators
- Like / Pass buttons

### 7. Confirmed Matches (Likes) Screen
- Grid/list of matched profiles
- Each cell: avatar, name, city
- Tap → view profile detail
- Option to unmatch
- "New matches" badge indicator

### 8. Messages List Screen
- **Top section**: Horizontal scroll of new matches (not yet messaged)
- **Below**: Vertical list of active conversations
  - Avatar, name, last message preview, timestamp
  - Unread badge
- Tap → individual chat screen
- Real-time updates via Firestore `onSnapshot`

### 9. Chat Screen
- Message bubbles (sent/received differentiation)
- Text input with send button
- Image/video attachment button (expo-image-picker)
- At top: link to view the matched user's property/profile
- Read receipts
- Real-time via Firestore `onSnapshot` on messages subcollection
- Auto-scroll to bottom on new message

### 10. Profile Screen
- View mode: avatar, name, age, city, bio, occupation, education, lifestyle badges
- Edit mode: edit all profile fields, change avatar, update housing details
- Preference sliders: age range, max distance
- Logout button
- Delete account option

---

## Proposed Changes

### Project Initialization

#### [NEW] Expo project initialization
- Run `npx -y create-expo-app@latest ./` to scaffold the Expo project in the `troomie/` directory
- Configure `app.json` / `app.config.ts` with app name, slug, icons, splash
- Install all dependencies listed in the tech stack table

---

### Firebase Configuration

#### [NEW] [config.ts](file:///home/sammyyakk/projects/classes/troomie/lib/firebase/config.ts)
Firebase initialization with environment variables from `.env`

#### [NEW] [auth.ts](file:///home/sammyyakk/projects/classes/troomie/lib/firebase/auth.ts)
Auth helper functions: signIn, signUp, signOut, resetPassword, emailVerification

#### [NEW] [firestore.ts](file:///home/sammyyakk/projects/classes/troomie/lib/firebase/firestore.ts)
Firestore CRUD: user profiles, swipes, matches, chat messages

#### [NEW] [storage.ts](file:///home/sammyyakk/projects/classes/troomie/lib/firebase/storage.ts)
Firebase Storage helpers: upload avatar, property photos, chat attachments

---

### Navigation & Layout

#### [NEW] [_layout.tsx](file:///home/sammyyakk/projects/classes/troomie/app/_layout.tsx)
Root layout with auth state gate — redirects to auth stack or tabs

#### [NEW] [(auth)/_layout.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(auth)/_layout.tsx)
Stack navigator for auth flow screens

#### [NEW] [(tabs)/_layout.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/_layout.tsx)
Bottom tab navigator: Matching, Likes, Messages, Profile

---

### Auth Screens

#### [NEW] [login.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(auth)/login.tsx)
#### [NEW] [signup.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(auth)/signup.tsx)
#### [NEW] [forgot-password.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(auth)/forgot-password.tsx)
#### [NEW] [verify-email.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(auth)/verify-email.tsx)

---

### Main App Screens

#### [NEW] [matching/index.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/matching/index.tsx)
Swipeable card stack with gesture handlers

#### [NEW] [matching/[id].tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/matching/[id].tsx)
Expanded property + tenant detail view

#### [NEW] [likes/index.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/likes/index.tsx)
Confirmed matches grid

#### [NEW] [messages/index.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/messages/index.tsx)
Conversation list with new-matches row

#### [NEW] [messages/[chatId].tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/messages/[chatId].tsx)
Individual chat screen

#### [NEW] [profile/index.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/profile/index.tsx)
View profile

#### [NEW] [profile/edit.tsx](file:///home/sammyyakk/projects/classes/troomie/app/(tabs)/profile/edit.tsx)
Edit profile form

---

### State Management

#### [NEW] [authStore.ts](file:///home/sammyyakk/projects/classes/troomie/stores/authStore.ts)
User session, profile data, loading states

#### [NEW] [matchStore.ts](file:///home/sammyyakk/projects/classes/troomie/stores/matchStore.ts)
Potential matches queue, swipe history, confirmed matches

#### [NEW] [chatStore.ts](file:///home/sammyyakk/projects/classes/troomie/stores/chatStore.ts)
Active conversations, unread counts

---

### Reusable Components

#### [NEW] `components/ui/` — Button, Input, Card, Avatar, Badge, Modal, Toast
#### [NEW] `components/matching/` — SwipeCard, CardStack, MatchModal
#### [NEW] `components/chat/` — ChatBubble, MessageInput, MediaPreview
#### [NEW] `components/profile/` — ProfileHeader, PreferenceSlider, LifestyleBadge

---

### Design System

#### [NEW] [theme.ts](file:///home/sammyyakk/projects/classes/troomie/constants/theme.ts)
Color palette, typography scale, spacing, border radii — shared across the app

**Color Direction**: Modern dark theme with vibrant accent gradients (coral → pink → purple). Glassmorphism cards with blur backgrounds. Premium feel similar to Hinge/Bumble but with its own identity.

---

## Verification Plan

### Automated Tests

Since this is a greenfield React Native project, I'll set up testing infrastructure:

1. **Unit tests** (Jest + React Native Testing Library):
   ```bash
   npx expo start  # verify the project boots without errors
   ```
   
2. **TypeScript compilation check**:
   ```bash
   npx tsc --noEmit  # ensure no type errors
   ```

3. **Lint check**:
   ```bash
   npx eslint . --ext .ts,.tsx  # code quality
   ```

### Manual Verification

Since React Native apps require a device/emulator, here's the verification process:

1. **Project boots**: Run `npx expo start` and verify the app opens on an Android emulator or iOS simulator without crashes
2. **Navigation works**: Verify all tab navigation and stack navigation transitions are functional
3. **Auth flow**: Create an account, verify email, log in, log out — all with Firebase
4. **Profile**: Upload avatar, edit fields, save — verify data persists in Firestore
5. **Matching**: Swipe cards left/right, verify swipe data is recorded, mutual likes trigger match modal
6. **Chat**: Send messages, verify real-time delivery, send image attachments
7. **Build**: Run `eas build --platform all --profile preview` to ensure both Android and iOS builds succeed

> [!TIP]
> I'd recommend we build incrementally — get the project scaffolded and auth working first, then layer on matching, then messaging. This lets us verify each feature works before adding complexity.
