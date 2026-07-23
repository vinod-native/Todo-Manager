import {createAsyncThunk, createSlice, nanoid} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storageKey = uid => `@todo-manager/lists/${uid}`;
export const hydrateTodos = createAsyncThunk('todos/hydrate', async uid => {
  const raw = await AsyncStorage.getItem(storageKey(uid));
  return {uid, lists: raw ? JSON.parse(raw) : []};
});

const todosSlice = createSlice({
  name: 'todos', initialState: {lists: [], ownerId: null, hydrated: false, error: null},
  reducers: {
    resetTodos: () => ({lists: [], ownerId: null, hydrated: false, error: null}),
    addList: {prepare: title => ({payload: {id: nanoid(), title: title.trim(), createdAt: Date.now(), items: []}}), reducer: (state, {payload}) => { state.lists.unshift(payload); }},
    updateList: (state, {payload}) => { const list = state.lists.find(x => x.id === payload.id); if (list) list.title = payload.title.trim(); },
    deleteList: (state, {payload}) => { state.lists = state.lists.filter(x => x.id !== payload); },
    addItem: {prepare: (listId, title) => ({payload: {listId, item: {id: nanoid(), title: title.trim(), completed: false, createdAt: Date.now()}}}), reducer: (state, {payload}) => { state.lists.find(x => x.id === payload.listId)?.items.unshift(payload.item); }},
    updateItem: (state, {payload}) => { const item = state.lists.find(x => x.id === payload.listId)?.items.find(x => x.id === payload.itemId); if (item) item.title = payload.title.trim(); },
    toggleItem: (state, {payload}) => { const item = state.lists.find(x => x.id === payload.listId)?.items.find(x => x.id === payload.itemId); if (item) item.completed = !item.completed; },
    deleteItem: (state, {payload}) => { const list = state.lists.find(x => x.id === payload.listId); if (list) list.items = list.items.filter(x => x.id !== payload.itemId); },
  },
  extraReducers: builder => builder
    .addCase(hydrateTodos.pending, state => { state.hydrated = false; state.error = null; })
    .addCase(hydrateTodos.fulfilled, (state, {payload}) => { state.lists = payload.lists; state.ownerId = payload.uid; state.hydrated = true; })
    .addCase(hydrateTodos.rejected, state => { state.hydrated = true; state.error = 'Could not load your saved lists.'; }),
});
export const {resetTodos, addList, updateList, deleteList, addItem, updateItem, toggleItem, deleteItem} = todosSlice.actions;
export {storageKey};
export default todosSlice.reducer;
