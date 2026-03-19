# Troomie — React Native Rebuild

## Planning
- [/] Read original SDP report and extract all requirements
- [/] Create comprehensive implementation plan with tech stack, architecture, and screen-by-screen design
- [ ] Get user approval on implementation plan

## Project Setup
- [ ] Initialize Expo (React Native) project with TypeScript
- [ ] Install and configure all dependencies
- [ ] Set up project structure (folders, navigation, theming)
- [ ] Configure Firebase (Auth, Firestore, Storage, Cloud Functions)

## Core Infrastructure
- [ ] Design system — theme, colors, typography, reusable components
- [ ] Navigation — bottom tab navigator + stack navigators
- [ ] Auth context / state management (Zustand)
- [ ] Firebase service layer (auth, firestore, storage helpers)

## Screens & Features
- [ ] Auth Flow: Login screen
- [ ] Auth Flow: Sign-up screen (multi-step)
- [ ] Auth Flow: Forgot password screen
- [ ] Auth Flow: Email verification gate
- [ ] Profile Screen: View & edit profile, avatar upload, age-range preference
- [ ] Matching Screen: Swipeable card stack (home + tenant info)
- [ ] Confirmed Matches (Likes) Screen
- [ ] Messaging: Conversation list with new-matches row
- [ ] Messaging: Chat screen with text + image/video attachments
- [ ] Property Detail: Expanded card view with home + tenant details

## Backend / Cloud Functions
- [ ] Matching logic — record swipes, detect mutual likes, create match
- [ ] Push notifications (Expo Notifications + FCM)
- [ ] User search / filtering by location & preferences

## Polish & Deployment
- [ ] Animations & micro-interactions (Reanimated / Moti)
- [ ] Responsive design audit (various device sizes)
- [ ] EAS Build configuration (Android + iOS)
- [ ] App store metadata & splash/icon assets
