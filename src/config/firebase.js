import {getApp, getApps, initializeApp} from 'firebase/app';
import {getAuth, initializeAuth} from 'firebase/auth';
import {getReactNativePersistence} from '@firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDYW1CKXh9X7QzSROWucIXLwDghsviHjy0",
  authDomain: "todo-1a866.firebaseapp.com",
  projectId: "todo-1a866",
  storageBucket: "todo-1a866.firebasestorage.app",
  messagingSenderId: "674306969067",
  appId: "1:674306969067:web:2b7df0b1b2a83e6c425dae",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (_error) {
  auth = getAuth(app);
}

export {auth};
