# Todo Manager

A local-first Todo Manager built with React Native CLI and JavaScript. Firebase Authentication provides Email/Password accounts and persisted sessions. Redux Toolkit manages multiple lists and their tasks, while AsyncStorage keeps each user's todo data on the device across restarts.

## Features

- Email/password sign in and registration with Firebase Authentication
- Animated branded splash screen during application startup
- Persistent Firebase sessions and auth-driven navigation
- Multiple todo lists: create, rename, view, and delete
- Todo items: create, edit, complete/uncomplete, and delete
- Per-user local storage (one isolated AsyncStorage key per Firebase UID)
- Input validation, friendly errors, destructive-action confirmations, empty states, and loading states
- Reducer tests covering complete list and item CRUD

## Project structure

```text
src/
  components/    Reusable inputs, buttons, modals, loading UI
  config/        Firebase initialization and session persistence
  navigation/    Authentication-aware root navigator
  screens/       Authentication, lists, and task screens
  store/         Redux Toolkit slices, thunks, and persistence
  theme/         Shared design tokens
  utils/         Validation and error mapping
```

## Prerequisites

- Node.js 22.11 or newer
- Android Studio/JDK 17 for Android, or Xcode/CocoaPods for iOS
- A Firebase project

## Firebase setup

1. In Firebase Console, create or select a project.
2. Open **Authentication → Sign-in method** and enable **Email/Password**.
3. Add a Web app to the Firebase project and copy its configuration.
4. Replace the placeholder values in `src/config/firebase.js` with that configuration. These Firebase client values identify the project; access is enforced by Firebase Authentication and Security Rules.

No Firestore or Realtime Database setup is required. Todo data is intentionally stored only in AsyncStorage.

## Install and run

```sh
npm install
npm start
```

In a second terminal:

```sh
npm run android
```

For iOS:

```sh
bundle install
cd ios && bundle exec pod install && cd ..
npm run ios
```

## Quality checks

```sh
npm run lint
npm test -- --runInBand
```

## Build an Android APK

Debug APK (suitable for review/testing):

```sh
cd android
./gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

For a distributable release, create a private upload keystore, configure signing values outside source control, and run `./gradlew assembleRelease`. See React Native's signed APK documentation; never commit release passwords or the private keystore.

## Persistence notes

Firebase Auth stores and restores the authenticated session through AsyncStorage. Todo lists are stored under `@todo-manager/lists/<firebase-uid>`. Redux is hydrated only after authentication resolves, and writes are debounced to avoid excessive device storage operations. Signing out clears in-memory state but preserves that user's local lists for their next sign-in on the same device.
