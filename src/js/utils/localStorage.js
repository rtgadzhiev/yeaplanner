const localStorageDefaultKey = 'todo-items';

export function getItemsFromLocalStorage(key = localStorageDefaultKey) {
  const data = localStorage.getItem(key);

  if (!data) return [];

  try {
    const parsedData = JSON.parse(data);
    return Array.isArray(parsedData) ? parsedData : [];
  } catch {
    console.error('Parse error!');
    return [];
  }
}

export function setItemsToLocalStorage(key = localStorageDefaultKey, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

export function updateTasksOrder(key = localStorageDefaultKey, items) {
  const taskElementsArray = [...document.querySelectorAll('.todo-item')];

  const newTasksOrder = taskElementsArray.map((taskElement) => {
    const taskId = taskElement.querySelector('input').id;

    return items.find((todo) => todo.id === taskId);
  });

  setItemsToLocalStorage(key, newTasksOrder);
}
