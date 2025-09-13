import createAppState from './appState.js';
import createSelectors from './selectors.js';
import createRenderManager from './renderManager.js';
import createEventHandlers from './eventHandlers.js';
import createDragAndDrop from './dragAndDrop.js';

const appState = createAppState();
const selectors = createSelectors();

const newTaskFormElement = document.querySelector(selectors.newTaskForm);
const newTaskFormInputElement = document.querySelector(
  selectors.newTaskFormInput
);
const allTasksCounterElement = document.querySelector(
  selectors.allTasksCounter
);
const completedTasksCounterElement = document.querySelector(
  selectors.completedTasksCounter
);
const todoListElement = document.querySelector(selectors.todoList);
const emptyMessageElement = document.querySelector(selectors.emptyMessage);
const searchFormElement = document.querySelector(selectors.searchForm);
const searchInputElement = searchFormElement.querySelector(
  selectors.searchInput
);

const renderManager = createRenderManager(
  appState,
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
const dragAndDrop = createDragAndDrop(appState, todoListElement);

renderManager.render();
renderManager.toggleDisableSearchInput(searchInputElement);

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
