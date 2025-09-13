export default function createEventHandlers(
  appState,
  renderManager,
  newTaskFormInputElement,
  searchInputElement
) {
  const onNewTaskFormSubmit = (event) => {
    event.preventDefault();

    const newTaskTitle = newTaskFormInputElement.value.trim();

    if (newTaskTitle.length) {
      appState.addTask(newTaskTitle);
      appState.filterTasks();
      renderManager.render();
      renderManager.toggleDisableSearchInput(searchInputElement);
      renderManager.clearInputValue(newTaskFormInputElement, true);
    }
  };

  const onRemoveButtonClick = ({ target }) => {
    const removeTaskButtonElement = target.closest(
      '[data-js-remove-task-button]'
    );

    if (removeTaskButtonElement) {
      const taskElement = target.closest('[data-js-todo-item]');
      const checkboxElement = taskElement.querySelector(
        '[data-js-todo-item-checkbox]'
      );

      taskElement.classList.add('is-disappearing');
      setTimeout(() => {
        appState.removeTask(checkboxElement.id);
        if (appState.getSearchQuery()) {
          appState.filterTasks();
        }

        renderManager.render();
        searchInputElement.focus();

        if (!appState.getTodoItems().length) {
          renderManager.clearInputValue(searchInputElement);
          appState.setSearchQuery('');
          renderManager.toggleDisableSearchInput(searchInputElement);
        }
      }, 400);
    }
  };

  const onEditButtonClick = ({ target }) => {
    const editTaskButtonElement = target.closest('[data-js-edit-task-button]');

    if (editTaskButtonElement) {
      const taskElement = editTaskButtonElement.closest('[data-js-todo-item]');
      const checkboxElement = taskElement.querySelector(
        '[data-js-todo-item-checkbox]'
      );
      const taskLabelElement = taskElement.querySelector(
        '[data-js-todo-label]'
      );
      const newTaskText = prompt(
        'Введите новый текст задачи',
        `${taskLabelElement.textContent.trim()}`
      );

      if (newTaskText) {
        const todoItems = appState.getTodoItems();
        const newTodoItems = todoItems.map((todo) => {
          if (todo.id === checkboxElement.id) {
            todo.title = newTaskText;
            return todo;
          }
          return todo;
        });
        appState.setTodoItems(newTodoItems);
        appState.setItemsToLocalStorage(newTodoItems);
        appState.filterTasks();
        renderManager.renderTasks();
        renderManager.renderEmptyMessage();
      }
      return;
    }
  };

  const onChange = ({ target }) => {
    if (target.matches('[data-js-todo-item-checkbox]')) {
      appState.toggleCheckedState(target.id);
      renderManager.renderCounters();
    }
  };

  const onSearchFormSubmit = (event) => {
    event.preventDefault();
  };

  const onSearchInputChange = ({ target }) => {
    const searchInputValueFormatted = target.value.trim();

    appState.setSearchQuery(searchInputValueFormatted);
    const searchQuery = appState.getSearchQuery();

    if (searchQuery.length > 0) {
      appState.filterTasks();
    } else {
      appState.resetFilter();
    }

    renderManager.renderEmptyMessage();
    renderManager.renderTasks();
  };

  return {
    onNewTaskFormSubmit,
    onRemoveButtonClick,
    onEditButtonClick,
    onChange,
    onSearchFormSubmit,
    onSearchInputChange,
  };
}
