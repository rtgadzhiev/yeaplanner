export default function createAppState() {
  const state = {
    todoItems: getItemsFromLocalStorage(),
    filteredItems: null,
    searchQuery: '',
  };

  function getTodoItems() {
    return state.todoItems;
  }

  function getFilteredItems() {
    return state.filteredItems;
  }

  function getSearchQuery() {
    return state.searchQuery;
  }

  function setTodoItems(items) {
    state.todoItems = items;
  }

  function setFilteredItems(items) {
    state.filteredItems = items;
  }

  function setSearchQuery(value) {
    state.searchQuery = value;
  }

  function getItemsFromLocalStorage(localStorageKey = 'todo-items') {
    const data = localStorage.getItem(localStorageKey);

    if (!data) return [];

    try {
      const parsedData = JSON.parse(data);
      return Array.isArray(parsedData) ? parsedData : [];
    } catch {
      console.error('Parse error!');
      return [];
    }
  }

  function setItemsToLocalStorage(items, localStorageKey = 'todo-items') {
    localStorage.setItem(localStorageKey, JSON.stringify(items));
  }

  function addTask(title) {
    state.todoItems.push({
      id: crypto?.randomUUID() ?? Date.now().toString(),
      title,
      isChecked: false,
    });
    setItemsToLocalStorage(state.todoItems);
  }

  function removeTask(id) {
    state.todoItems = state.todoItems.filter((todo) => todo.id !== id);
    if (state.filteredItems && state.filteredItems.length) {
      state.filteredItems = state.filteredItems.filter(
        (todo) => todo.id !== id
      );
    }

    setItemsToLocalStorage(state.todoItems);
  }

  function toggleCheckedState(id) {
    state.todoItems = state.todoItems.map((todo) => {
      if (todo.id === id) {
        return {
          ...todo,
          isChecked: !todo.isChecked,
        };
      }
      return todo;
    });
    setItemsToLocalStorage(state.todoItems);
  }

  function filterTasks() {
    if (state.searchQuery.length > 0) {
      const queryFormatted = state.searchQuery.toLowerCase();
      state.filteredItems = state.todoItems.filter(({ title }) => {
        const titleFormatted = title.toLowerCase();

        return titleFormatted.includes(queryFormatted);
      });
    } else {
      resetFilter();
    }
  }

  function resetFilter() {
    state.filteredItems = null;
  }

  return {
    getTodoItems,
    getFilteredItems,
    getSearchQuery,
    setTodoItems,
    setFilteredItems,
    setSearchQuery,
    getItemsFromLocalStorage,
    setItemsToLocalStorage,
    addTask,
    removeTask,
    toggleCheckedState,
    filterTasks,
    resetFilter,
  };
}
