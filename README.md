# Todo Manager

A polished, local-first task management app built with React Native CLI. Users
can create an account, organize tasks into multiple lists, track completion
progress, and keep their data available across app restarts.

## App flow

```text
Splash → Onboarding → Sign In / Sign Up → Dashboard → Task List
```

Onboarding is displayed only on the first launch. Firebase restores signed-in
sessions automatically, so returning users can continue from the dashboard.

## Features

### Onboarding and authentication

- Animated splash screen and smooth three-step onboarding
- First-launch onboarding persistence with AsyncStorage
- Firebase email/password sign in and registration
- Full name and password confirmation during sign up
- Saved Firebase display name
- Sign In/Sign Up tab transition with automatic form reset
- Client-side email and password validation
- Friendly messages for invalid credentials, duplicate accounts, weak
  passwords, rate limits, and connectivity failures

### Dashboard and lists

- Personalized header with avatar, name, and email
- Logout confirmation modal with Yes/No actions
- Live task-based completion percentage and progress bar
- Total lists, total tasks, and remaining-task statistics
- Create, rename, open, and delete multiple lists
- Per-list task count and completion progress
- Three-dot list action menu with Edit and Delete options
- Custom delete confirmation modal
- Helpful empty state for first-time users

### Tasks

- Create, edit, complete, reopen, and delete tasks
- Live progress summary for each list
- Three-dot task action menu
- Custom task delete confirmation modal
- Accessible completion checkboxes and action labels
- Improved empty state and floating add button

### UI and experience

- Consistent Ionicons vector icon system
- Shared colors, spacing, cards, and shadows
- Keyboard-aware authentication and edit forms
- Safe-area support for modern Android and iOS devices
- Loading, empty, validation, and destructive-action states

## Tech stack

- React Native 0.86 and React 19
- React Navigation native stack
- Redux Toolkit and React Redux
- Firebase Authentication
- AsyncStorage
- React Native Vector Icons (Ionicons)
- Jest and ESLint

## Project structure

```text
src/
  components/    Reusable buttons, inputs, loading view, and edit modal
  config/        Firebase initialization and session persistence
  navigation/    Splash, onboarding, and authentication-aware navigation
  screens/       Onboarding, authentication, dashboard, and task screens
  store/         Auth/todo state, async actions, selectors, and persistence
  theme/         Shared colors and shadows
  utils/         Form validation and authentication error mapping
```

## Prerequisites

- Node.js 22.11 or newer
- Android Studio and a compatible JDK for Android development
- Xcode, Ruby/Bundler, and CocoaPods for iOS development
- A Firebase project with Email/Password Authentication enabled

## Firebase setup

1. Create or select a project in the Firebase Console.
2. Go to **Authentication → Sign-in method**.
3. Enable the **Email/Password** provider.
4. Register a Firebase Web app.
5. Add its configuration values to `src/config/firebase.js`.

Firestore and Realtime Database are not required. Firebase handles
authentication, while todo data is stored locally per signed-in user.

## Installation

```sh
npm install
```

For iOS, install native pods:

```sh
bundle install
cd ios
bundle exec pod install
cd ..
```

## Running the app

Start Metro:

```sh
npm start
```

Run the desired platform in another terminal:

```sh
npm run android
```

or:

```sh
npm run ios
```

## Quality checks

```sh
npm run lint
npm test -- --runInBand
```

The tests cover list/task CRUD, dashboard progress calculations, email
validation edge cases, and authentication error mapping.

## Local persistence

Firebase Authentication persists the active session through AsyncStorage.
Todo lists are isolated by Firebase user ID and stored under:

```text
@todo-manager/lists/<firebase-uid>
```

Redux hydrates the correct user's lists after authentication finishes. Local
writes are debounced to avoid unnecessary storage operations. Logging out
clears in-memory todo state but preserves the user's stored lists for their next
sign-in on the same device.

## Android debug APK

```sh
cd android
./gradlew assembleDebug
```

The generated APK is available at:

```text
android/app/build/outputs/apk/debug/app-debug.apk
```

For production distribution, configure a private release keystore and keep all
signing credentials outside source control.
