import {configureStore} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './authSlice';
import todosReducer, {storageKey} from './todosSlice';

export const store = configureStore({reducer: {auth: authReducer, todos: todosReducer}});

let saveTimer;
store.subscribe(() => {
  const {lists, ownerId, hydrated} = store.getState().todos;
  if (!ownerId || !hydrated) return;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    AsyncStorage.setItem(storageKey(ownerId), JSON.stringify(lists)).catch(() => {});
  }, 250);
});
