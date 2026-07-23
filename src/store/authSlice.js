import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile} from 'firebase/auth';
import {auth} from '../config/firebase';
import {friendlyAuthError} from '../utils/validation';

export const login = createAsyncThunk('auth/login', async ({email, password}, api) => {
  try { await signInWithEmailAndPassword(auth, email.trim(), password); }
  catch (error) { return api.rejectWithValue(friendlyAuthError(error)); }
});
export const register = createAsyncThunk('auth/register', async ({name, email, password}, api) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(credential.user, {displayName: name.trim()});
  }
  catch (error) { return api.rejectWithValue(friendlyAuthError(error)); }
});
export const logout = createAsyncThunk('auth/logout', async (_, api) => {
  try { await signOut(auth); }
  catch (error) { return api.rejectWithValue(friendlyAuthError(error)); }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {user: null, initializing: true, loading: false, error: null},
  reducers: {
    authStateChanged: (state, {payload}) => {
      state.user = payload ? {uid: payload.uid, email: payload.email, name: payload.displayName || ''} : null;
      state.initializing = false; state.error = null;
    },
    clearAuthError: state => { state.error = null; },
  },
  extraReducers: builder => {
    [login, register, logout].forEach(thunk => {
      builder.addCase(thunk.pending, state => { state.loading = true; state.error = null; });
      builder.addCase(thunk.fulfilled, state => { state.loading = false; });
      builder.addCase(thunk.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
    });
  },
});
export const {authStateChanged, clearAuthError} = authSlice.actions;
export default authSlice.reducer;
