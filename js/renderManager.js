export default function createRenderManager(
  appState,
  allTasksCounterElement,
  completedTasksCounterElement,
  todoListElement,
  emptyMessageElement
) {
  function renderCounters(todoItems = appState.getTodoItems()) {
    const allTasksNumber = todoItems.length;
    const completedTasksNumber = todoItems.filter(
      (task) => task.isChecked
    ).length;

    allTasksCounterElement.textContent = `${allTasksNumber}`;
    completedTasksCounterElement.textContent = `${
      !allTasksNumber ? '0' : `${completedTasksNumber} из ${allTasksNumber}`
    }`;
  }

  function renderTasks(
    filteredItems = appState.getFilteredItems(),
    todoItems = appState.getTodoItems()
  ) {
    const items = filteredItems ?? todoItems;

    todoListElement.innerHTML = items
      .map((task) => {
        return `
        <li class="todo__item todo-item" data-js-todo-item draggable="true">
          <input class="todo-item__checkbox" type="checkbox" id="${task.id}" ${
          task.isChecked ? 'checked' : ''
        } data-js-todo-item-checkbox />
          <label class="todo-item__label" for="${task.id}" data-js-todo-label
            >${task.title} </label
          >
          <div class="todo-item__controls">
            <button
              class="todo-item__button todo-item__button--edit button"
              aria-label="Изменить задачу"
              data-js-edit-task-button
            >
              <svg class="todo-item__button-icon" width="13" height="13">
                <use href="./assets/images/icons/sprite.svg#icon-edit">
                </use>
              </svg>
            </button>
            <button
              class="todo-item__button todo-item__button--remove button"
              aria-label="Удалить задачу"
              data-js-remove-task-button
            >
              <svg class="todo-item__button-icon" width="24" height="24">
                <use href="./assets/images/icons/sprite.svg#icon-remove">
                </use>
              </svg>
            </button>
          </div>
        </li>
    `;
      })
      .join('');
  }

  function renderEmptyMessage(
    filteredItems = appState.getFilteredItems(),
    todoItems = appState.getTodoItems()
  ) {
    const isEmptyItems = todoItems.length === 0;
    const isEmptyFilteredItems = filteredItems && filteredItems.length === 0;
    const iconPath = './assets/images/icons/icon-list.svg';

    emptyMessageElement.innerHTML = isEmptyItems
      ? `<img src=${iconPath}></img>
          <span>У вас пока нет задач</span>Создавайте и организуйте свои задачи`
      : isEmptyFilteredItems
      ? `<img src=${iconPath}></img>
        <span>Задачи не найдены</span>Введите другое название задачи`
      : '';
  }

  function toggleDisableSearchInput(
    searchInputElement,
    todoItems = appState.getTodoItems()
  ) {
    if (todoItems.length === 0) {
      searchInputElement.setAttribute('disabled', true);
    } else {
      searchInputElement.removeAttribute('disabled');
    }
  }

  function clearInputValue(inputElement, isFocus = false) {
    inputElement.value = '';
    if (isFocus) {
      inputElement.focus();
    }
  }

  function render(
    filteredItems = appState.getFilteredItems(),
    todoItems = appState.getTodoItems()
  ) {
    renderCounters(todoItems);
    renderTasks(filteredItems, todoItems);
    renderEmptyMessage(filteredItems, todoItems);
  }

  return {
    renderCounters,
    renderEmptyMessage,
    renderTasks,
    render,
    toggleDisableSearchInput,
    clearInputValue,
  };
}
