export default function createAppState(localStorageKey = 'todo-items') {
  const state = {
    todoItems: getItemsFromLocalStorage(localStorageKey),
    filteredItems: null,
    searchQuery: '',
  };

  function getItemsFromLocalStorage() {
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

  function setItemsToLocalStorage(items) {
    localStorage.setItem(localStorageKey, JSON.stringify(items));
  }

  function updateTasksOrder(items) {
    const taskElementsArray = [...document.querySelectorAll('.todo-item')];

    const newTasksOrder = taskElementsArray.map((taskElement) => {
      const taskId = taskElement.querySelector('input').id;

      return items.find((todo) => todo.id === taskId);
    });

    setItemsToLocalStorage(newTasksOrder);
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
    const queryFormatted = state.searchQuery.toLowerCase();

    state.filteredItems = state.todoItems.filter(({ title }) => {
      const titleFormatted = title.toLowerCase();

      return titleFormatted.includes(queryFormatted);
    });
  }

  function resetFilter() {
    state.filteredItems = null;
  }

  return {
    state,
    getItemsFromLocalStorage,
    setItemsToLocalStorage,
    updateTasksOrder,
    addTask,
    removeTask,
    toggleCheckedState,
    filterTasks,
    resetFilter,
  };
}
