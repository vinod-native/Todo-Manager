import reducer, {addItem, addList, deleteItem, deleteList, toggleItem, updateItem, updateList} from '../src/store/todosSlice';

describe('todos reducer', () => {
  test('supports complete list and item CRUD', () => {
    let state = reducer(undefined, addList('Work'));
    const listId = state.lists[0].id;
    state = reducer(state, updateList({id: listId, title: 'Projects'}));
    state = reducer(state, addItem(listId, 'Ship app'));
    const itemId = state.lists[0].items[0].id;
    state = reducer(state, updateItem({listId, itemId, title: 'Ship Todo app'}));
    state = reducer(state, toggleItem({listId, itemId}));
    expect(state.lists[0]).toMatchObject({title: 'Projects'});
    expect(state.lists[0].items[0]).toMatchObject({title: 'Ship Todo app', completed: true});
    state = reducer(state, deleteItem({listId, itemId}));
    expect(state.lists[0].items).toHaveLength(0);
    state = reducer(state, deleteList(listId));
    expect(state.lists).toHaveLength(0);
  });
});
