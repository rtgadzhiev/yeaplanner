import {
  getItemsFromLocalStorage,
  setItemsToLocalStorage,
  updateTasksOrder,
} from './utils/localStorage.js';

const localStorageKey = 'todo-items';

const newTaskFormElement = document.querySelector('[data-js-new-task-form]');
const newTaskFormInputElement = document.querySelector(
  '[data-js-new-task-form-input]'
);

const allTasksCounterElement = document.querySelector(
  '[data-js-all-tasks-counter]'
);
const completedTasksCounterElement = document.querySelector(
  '[data-js-completed-tasks-counter]'
);
const todoListElement = document.querySelector('[data-js-todo-list]');
const emptyMessageElement = document.querySelector(
  '[data-js-todo-empty-message]'
);

const searchFormElement = document.querySelector('[data-js-search-form]');
const searchInputElement = searchFormElement.querySelector(
  '[ data-js-search-form-input]'
);

const state = {
  todoItems: getItemsFromLocalStorage(localStorageKey),
  filteredItems: null,
  searchQuery: null,
};

function renderCounters() {
  const allTasksNumber = state.todoItems.length;
  const completedTasksNumber = state.todoItems.filter(
    (task) => task.isChecked
  ).length;

  allTasksCounterElement.textContent = `${allTasksNumber}`;
  completedTasksCounterElement.textContent = `${
    !allTasksNumber ? '0' : `${completedTasksNumber} из ${allTasksNumber}`
  }`;
}

function renderTasks() {
  toggleDisableSearchInput();
  const items = state.filteredItems ?? state.todoItems;

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
              <svg
                width="13"
                height="13"
                viewBox="0 0 13 13"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.7829 0.52164C11.0873 -0.173879 9.95967 -0.173881 9.26413 0.52164L0.859294 8.92649C0.610667 9.17512 0.441194 9.49178 0.37224 9.83652L0.0237172 11.5792C-0.142442 12.4099 0.590043 13.1424 1.42084 12.9763L3.16345 12.6277C3.50823 12.5588 3.82489 12.3893 4.07352 12.1407L12.4783 3.73585C13.1739 3.04034 13.1739 1.91268 12.4783 1.21716L11.7829 0.52164ZM10.1037 1.3612C10.3356 1.12937 10.7114 1.12937 10.9433 1.3612L11.6388 2.05673C11.8707 2.28856 11.8707 2.66445 11.6388 2.89629L10.0528 4.48231L8.51772 2.94723L10.1037 1.3612ZM7.6781 3.7868L1.69886 9.76605C1.61598 9.84893 1.5595 9.95448 1.53651 10.0694L1.18799 11.812L2.93059 11.4635C3.04552 11.4405 3.15108 11.384 3.23395 11.3011L9.21319 5.32188L7.6781 3.7868Z"
                  fill="#808080"
                />
              </svg>
            </button>
            <button
              class="todo-item__button todo-item__button--remove button"
              aria-label="Удалить задачу"
              data-js-remove-task-button
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.2021 9.98548H12.8716V15.5073H14.2021V9.98548Z"
                  fill="#808080"
                />
                <path
                  d="M11.4624 9.98548H10.1318V15.5073H11.4624V9.98548Z"
                  fill="#808080"
                />
                <path
                  d="M18.478 7.16712C18.4754 7.03061 18.4295 6.89846 18.3469 6.78975C18.2642 6.68104 18.1492 6.6014 18.0184 6.56232C17.9596 6.53782 17.8974 6.52252 17.8339 6.51696H14.2868C14.1525 6.07791 13.8808 5.69355 13.5117 5.42047C13.1426 5.14739 12.6956 5 12.2365 5C11.7774 5 11.3304 5.14739 10.9613 5.42047C10.5922 5.69355 10.3205 6.07791 10.1862 6.51696H6.63911C6.58068 6.51814 6.52269 6.52729 6.46674 6.54418H6.45162C6.31318 6.58701 6.19334 6.67547 6.11163 6.79515C6.02992 6.91483 5.99117 7.05866 6.00169 7.20319C6.01222 7.34771 6.0714 7.48441 6.16958 7.59099C6.26776 7.69757 6.39916 7.76774 6.54234 7.79006L7.25298 17.5334C7.26382 17.9127 7.41693 18.2741 7.68191 18.5458C7.94688 18.8175 8.30435 18.9797 8.68332 19H15.7867C16.1662 18.9804 16.5244 18.8186 16.79 18.5468C17.0556 18.2751 17.2092 17.9132 17.22 17.5334L17.9277 7.79914C18.0802 7.77797 18.22 7.70232 18.3212 7.58615C18.4223 7.46999 18.478 7.32116 18.478 7.16712ZM12.2365 6.21456C12.3661 6.21458 12.4943 6.24146 12.6129 6.29351C12.7316 6.34556 12.8382 6.42164 12.926 6.51696H11.547C11.6346 6.42135 11.7411 6.34507 11.8599 6.29299C11.9786 6.24092 12.1069 6.21421 12.2365 6.21456ZM15.7867 17.7904H8.68332C8.60168 17.7904 8.47467 17.6573 8.45955 17.4457L7.75798 7.81123H16.715L16.0135 17.4457C15.9984 17.6573 15.8714 17.7904 15.7867 17.7904Z"
                  fill="#808080"
                />
              </svg>
            </button>
          </div>
        </li>
    `;
    })
    .join('');
}

function renderEmptyMessage() {
  const isEmptyItems = state.todoItems.length === 0;
  const isEmptyFilteredItems =
    state.filteredItems && state.filteredItems.length === 0;

  emptyMessageElement.innerHTML = isEmptyItems
    ? `<svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
              stroke="#0d0d0d"
              stroke-width="1.5"
            />
            <path
              d="M8 14H16"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M7 10.5H17"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M9 17.5H15"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
              stroke="#0d0d0d"
              stroke-width="1.5"
            />
          </svg>
          <span>У вас пока нет задач</span>Создавайте и организуйте свои задачи`
    : isEmptyFilteredItems
    ? `<svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
              stroke="#0d0d0d"
              stroke-width="1.5"
            />
            <path
              d="M8 14H16"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M7 10.5H17"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M9 17.5H15"
              stroke="#0d0d0d"
              stroke-width="1.5"
              stroke-linecap="round"
            />
            <path
              d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
              stroke="#0d0d0d"
              stroke-width="1.5"
            />
          </svg>
          <span>Задачи не найдены</span>Введите другое название задачи`
    : '';
}

function render() {
  renderCounters();
  renderTasks();
  renderEmptyMessage();
}

render();

function addTask(title) {
  state.todoItems.push({
    id: crypto?.randomUUID() ?? Date.now().toString(),
    title,
    isChecked: false,
  });
  setItemsToLocalStorage(localStorageKey, state.todoItems);
  render();
}

function removeTask(id) {
  state.todoItems = state.todoItems.filter((todo) => todo.id !== id);

  setItemsToLocalStorage(localStorageKey, state.todoItems);
  render();
}

const onNewTaskFormSubmit = (event) => {
  event.preventDefault();

  const newTaskTitle = newTaskFormInputElement.value;

  if (newTaskTitle.trim().length) {
    addTask(newTaskTitle);
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

    setTimeout(removeTask, 400, checkboxElement.id);
  }
};

const onEditButtonClick = ({ target }) => {
  const editTaskButtonElement = target.closest('[data-js-edit-task-button]');

  if (editTaskButtonElement) {
    const taskElement = editTaskButtonElement.closest('[data-js-todo-item]');
    const checkboxElement = taskElement.querySelector(
      '[data-js-todo-item-checkbox]'
    );
    const newTaskText = prompt('Введите новый текст задачи');

    if (newTaskText) {
      state.todoItems = state.todoItems.map((todo) => {
        if (todo.id === checkboxElement.id) {
          todo.title = newTaskText;
          return todo;
        }
        return todo;
      });
      setItemsToLocalStorage(localStorageKey, state.todoItems);
      renderTasks();
    }
    return;
  }
};

const onChange = ({ target }) => {
  if (target.matches('[data-js-todo-item-checkbox]')) {
    toggleCheckedState(target.id);
  }
};

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
  setItemsToLocalStorage(localStorageKey, state.todoItems);
  renderCounters();
}

newTaskFormElement.addEventListener('submit', onNewTaskFormSubmit);
todoListElement.addEventListener('click', onRemoveButtonClick);
todoListElement.addEventListener('click', onEditButtonClick);
todoListElement.addEventListener('change', onChange);

const onDragStart = ({ target }) => {
  const isDraggable = target.hasAttribute('draggable');

  if (isDraggable) {
    target.classList.add('is-dragging');
  }
};

const onDragEnd = ({ target }) => {
  const isDraggable = target.hasAttribute('draggable');

  if (isDraggable) {
    target.classList.remove('is-dragging');
  }

  updateTasksOrder(localStorageKey, state.todoItems);
};

function getDragAfterElement(y) {
  const draggableElements = [
    ...todoListElement.querySelectorAll('.todo-item:not(.is-dragging)'),
  ];

  return draggableElements.reduce(
    (closestTodo, todo) => {
      const box = todo.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closestTodo.offset) {
        return { offset: offset, element: todo };
      } else {
        return closestTodo;
      }
    },
    {
      offset: Number.NEGATIVE_INFINITY,
    }
  ).element;
}

const onDragOver = (event) => {
  event.preventDefault();

  const afterElement = getDragAfterElement(event.clientY);
  const draggableElement = document.querySelector('.is-dragging');

  if (!afterElement) {
    todoListElement.append(draggableElement);
  } else {
    todoListElement.insertBefore(draggableElement, afterElement);
  }
};

function bindDragAndDropEvents() {
  todoListElement.addEventListener('dragstart', onDragStart);
  todoListElement.addEventListener('dragend', onDragEnd);
  todoListElement.addEventListener('dragover', onDragOver);
}

bindDragAndDropEvents();

function toggleDisableSearchInput() {
  if (state.todoItems.length === 0) {
    searchInputElement.setAttribute('disabled', true);
  } else {
    searchInputElement.removeAttribute('disabled');
  }
}

const onSearchFormSubmit = (event) => {
  event.preventDefault();
};

function filterTasks() {
  const queryFormatted = state.searchQuery.toLowerCase();

  state.filteredItems = state.todoItems.filter(({ title }) => {
    const titleFormatted = title.toLowerCase();

    return titleFormatted.includes(queryFormatted);
  });

  if (state.filteredItems.length === 0) {
    renderEmptyMessage();
    renderTasks();
  } else {
    renderTasks();
  }
}

function resetFilter() {
  state.filteredItems = null;
  renderEmptyMessage();
  renderTasks();
}

const onSearchInputChange = ({ target }) => {
  state.searchQuery = target.value.trim();

  if (state.searchQuery.length > 0) {
    filterTasks();
  } else {
    resetFilter();
  }
};

searchFormElement.addEventListener('submit', onSearchFormSubmit);
searchInputElement.addEventListener('input', onSearchInputChange);
