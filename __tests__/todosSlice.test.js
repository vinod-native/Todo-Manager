import reducer, {
  addItem,
  addList,
  deleteItem,
  deleteList,
  selectTodoStats,
  toggleItem,
  updateItem,
  updateList,
} from '../src/store/todosSlice';

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

  test('calculates dashboard progress from task completion', () => {
    let todos = reducer(undefined, addList('Work'));
    const listId = todos.lists[0].id;

    expect(selectTodoStats({todos})).toEqual({
      total: 0,
      completed: 0,
      remaining: 0,
      progress: 0,
    });

    todos = reducer(todos, addItem(listId, 'First task'));
    todos = reducer(todos, addItem(listId, 'Second task'));
    let stats = selectTodoStats({todos});
    expect(stats).toMatchObject({total: 2, completed: 0, progress: 0});

    const itemId = todos.lists[0].items[0].id;
    todos = reducer(todos, toggleItem({listId, itemId}));
    stats = selectTodoStats({todos});
    expect(stats).toEqual({
      total: 2,
      completed: 1,
      remaining: 1,
      progress: 50,
    });
  });
});
