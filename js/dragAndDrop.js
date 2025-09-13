export default function createDragAndDrop(appState, todoListElement) {
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

    const todoItems = appState.getTodoItems();
    const newTasksOrder = updateTasksOrder(todoItems);
    appState.setItemsToLocalStorage(newTasksOrder);
  };

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

  function updateTasksOrder(items) {
    const taskElementsArray = [...document.querySelectorAll('.todo-item')];

    const newTasksOrder = taskElementsArray.map((taskElement) => {
      const taskId = taskElement.querySelector('input').id;

      return items.find((todo) => todo.id === taskId);
    });

    return newTasksOrder;
  }

  return {
    onDragStart,
    onDragEnd,
    onDragOver,
    updateTasksOrder,
  };
}
