export default function createEventHandlers(
  appState,
  renderManager,
  newTaskFormInputElement,
  searchInputElement
) {
  const onNewTaskFormSubmit = (event) => {
    event.preventDefault();

    const newTaskTitle = newTaskFormInputElement.value;

    if (newTaskTitle.trim().length) {
      appState.addTask(newTaskTitle);
      appState.filterTasks();
      renderManager.render(
        appState.state.filteredItems,
        appState.state.todoItems
      );
      renderManager.toggleDisableSearchInput(
        appState.state.todoItems,
        searchInputElement
      );

      newTaskFormInputElement.value = '';
      newTaskFormInputElement.focus();
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
        if (appState.state.searchQuery) {
          appState.filterTasks();
        }

        renderManager.render(
          appState.state.filteredItems,
          appState.state.todoItems
        );
        if (!appState.state.todoItems.length) {
          searchInputElement.value = '';
          renderManager.toggleDisableSearchInput(
            appState.state.todoItems,
            searchInputElement
          );
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
        appState.state.todoItems = appState.state.todoItems.map((todo) => {
          if (todo.id === checkboxElement.id) {
            todo.title = newTaskText;
            return todo;
          }
          return todo;
        });
        appState.setItemsToLocalStorage(appState.state.todoItems);
        renderManager.renderTasks(appState.state.todoItems);
      }
      return;
    }
  };

  const onChange = ({ target }) => {
    if (target.matches('[data-js-todo-item-checkbox]')) {
      appState.toggleCheckedState(target.id);
      renderManager.renderCounters(appState.state.todoItems);
    }
  };

  const onSearchFormSubmit = (event) => {
    event.preventDefault();
  };

  const onSearchInputChange = ({ target }) => {
    appState.state.searchQuery = target.value.trim();

    if (appState.state.searchQuery.length > 0) {
      appState.filterTasks();
      if (appState.state.filteredItems.length === 0) {
        renderManager.renderEmptyMessage(
          appState.state.filteredItems,
          appState.state.todoItems
        );
        renderManager.renderTasks(
          appState.state.filteredItems,
          appState.state.todoItems
        );
      } else {
        renderManager.renderTasks(
          appState.state.filteredItems,
          appState.state.todoItems
        );
        renderManager.renderEmptyMessage(
          appState.state.filteredItems,
          appState.state.todoItems
        );
      }
    } else {
      appState.resetFilter();
      renderManager.renderEmptyMessage(
        appState.state.filteredItems,
        appState.state.todoItems
      );
      renderManager.renderTasks(
        appState.state.filteredItems,
        appState.state.todoItems
      );
    }
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
