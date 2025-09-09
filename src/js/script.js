import { createAppState } from './appState.js';
import { createRenderManager } from './renderManager.js';
import { createEventHandlers } from './eventHandlers.js';
import { initDragAndDrop } from './dragAndDrop.js';

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

const appState = createAppState();
const renderManager = createRenderManager(
  allTasksCounterElement,
  completedTasksCounterElement,
  todoListElement,
  emptyMessageElement
);
const eventHandlers = createEventHandlers(
  appState,
  renderManager,
  newTaskFormInputElement,
  searchInputElement
);
const dragAndDrop = initDragAndDrop(appState, todoListElement);

renderManager.render(appState.state.filteredItems, appState.state.todoItems);
renderManager.toggleDisableSearchInput(
  appState.state.todoItems,
  searchInputElement
);

newTaskFormElement.addEventListener(
  'submit',
  eventHandlers.onNewTaskFormSubmit
);
todoListElement.addEventListener('click', eventHandlers.onRemoveButtonClick);
todoListElement.addEventListener('click', eventHandlers.onEditButtonClick);
todoListElement.addEventListener('change', eventHandlers.onChange);

todoListElement.addEventListener('dragstart', dragAndDrop.onDragStart);
todoListElement.addEventListener('dragend', dragAndDrop.onDragEnd);
todoListElement.addEventListener('dragover', dragAndDrop.onDragOver);

searchFormElement.addEventListener('submit', eventHandlers.onSearchFormSubmit);
searchInputElement.addEventListener('input', eventHandlers.onSearchInputChange);
