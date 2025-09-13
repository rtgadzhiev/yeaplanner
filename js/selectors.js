export default function createSelectors() {
  const newTaskForm = '[data-js-new-task-form]';
  const newTaskFormInput = '[data-js-new-task-form-input]';
  const allTasksCounter = '[data-js-all-tasks-counter]';
  const completedTasksCounter = '[data-js-completed-tasks-counter]';
  const todoList = '[data-js-todo-list]';
  const emptyMessage = '[data-js-todo-empty-message]';
  const searchForm = '[data-js-search-form]';
  const searchInput = '[data-js-search-form-input]';

  return {
    newTaskForm,
    newTaskFormInput,
    allTasksCounter,
    completedTasksCounter,
    todoList,
    emptyMessage,
    searchForm,
    searchInput,
  };
}
