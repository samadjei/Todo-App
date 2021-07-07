// SELECTORS
const theme = document.getElementById('theme');
const todoInput = document.querySelector('.todo-input');
const todoList = document.querySelector('.todo-list');
const removeList = document.querySelector('.remove');
const itemsLeft = document.querySelector('.items-left span');
const draggableItem = document.querySelectorAll('.draggable');
const todoContainer = document.querySelectorAll('.todo-container');

// EVENT LISTENERS

// Theme Switcher - alternating between light and dark mode
theme.addEventListener('click', () => {
	document.querySelector('body').classList = [theme.checked ? 'light-theme' : 'dark-theme'];
});

// Event Listener on input
todoInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' && todoInput.value.length > 0) {
		// When there is a keypress, it will run this function which will create a new list
		// The function will grab the value of the text entered
		createNewTodoItem(todoInput.value);
	}
});

// Removes the input text after submission
todoInput.addEventListener('keypress', (e) => {
	if (e.key === 'Enter' && todoInput.value.length > 0) {
		todoInput.value = '';
	}
});

// Targeting the parent element of the list items so if the user selects a list item with a remove class, it is deleted
todoList.addEventListener('click', (event) => {
	if (event.target.classList.contains('remove')) {
		removeTodoItem(event.target.parentElement);
		// Removes the items from local storage
		removeLocalTodos(event.target.parentElement);
		console.log('hello');
	}
});

todoList.addEventListener('click', (e) => {
	// Add drag
	draggable.addEventListener('dragstart', () => {
		draggable.classList.add('dragging');
	});
});

// Clear Completed Items
document.querySelector('.clear').addEventListener('click', () => {
	document.querySelectorAll('.list-item input[type="checkbox"]:checked').forEach((item) => {
		removeTodoItem(item.closest('li'));
		console.log(item.matches('li'));
	});
});

// document.querySelector('.clear').addEventListener('click', () => {
// 	document.querySelectorAll('.list-item input[type="checkbox"]:checked').forEach((item) => {
// 		// removeTodoItem(item.closest('div li'));
// 		console.log(item.closest(''));
// 	});
// });

// Check if the content has loaded
document.addEventListener('DOMContentLoaded', getTodos);

// Clear Input after enter event
function clearInput() {
	if (e.key === 'Enter' && todoInput.value.length > 0) {
		// When there is a keypress, it will run this function which will create a new list
		// The function will grab the value of the text entered
		createNewTodoItem(todoInput.value);
	}
}

// Drag Events
draggableItem.forEach((draggable) => {
	// Add drag
	draggable.addEventListener('dragstart', () => {
		draggable.classList.add('dragging');
	});
	// Remove drag
	draggable.addEventListener('dragend', () => {
		draggable.classList.remove('dragging');
	});
});

// Allow us to move the item inside the container
todoContainer.forEach((container) => {
	container.addEventListener('dragover', (e) => {
		// Enable dropping inside the element
		e.preventDefault();
		// The Y position of our mouse on the screen
		const afterElement = getDragAfterElement(container, e.clientY);
		// Get the element we're currently dragging
		const draggable = document.querySelector('.dragging');
		// Determining if we are above a list or not
		// Determine where to append the list
		if (afterElement == null) {
			// Appending it to the bottom of the container
			container.appendChild(draggable);
		} else {
			// determine which element we are inserting before
			container.insertBefore(draggable, afterElement);
		}
	});
});

// Determine the order of our elements based on the mouse position and return whichever element our mouse position is directly after
function getDragAfterElement(container, y) {
	// get every draggable that is not dragging
	// Using the spread operator to create a new array
	const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging')];
	// Loop through all the elements in the draggable list and determine which single element is directly after our mouse cursor based on the y position
	return draggableElements.reduce(
		(closest, child) => {
			// Give us a rectangle for our box
			const box = child.getBoundingClientRect();
			// Get the distance between our box and the cursor
			const offset = y - box.top - box.height / 2;
			// We want to be concerned with elements that are hovering
			if (offset < 0 && offset > closest.offset) {
				return { offset: offset, element: child };
			} else {
				return closest;
			}
		},
		{ offset: Number.NEGATIVE_INFINITY }
	).element;
}

// FUNCTIONS

// This function will create the list items from the value collected from the event listener and append it to the ul
function createNewTodoItem(text) {
	const list = document.createElement('li');
	list.classList.add('list-items');
	list.innerHTML = `
	<label class="list-item">
		<input type="checkbox" name="todoItem"/>
		<span class="checkmark"></span>
		<span class="text">${text}</span>
	</label>
		<span class="remove"></span>
	`;

	if (document.querySelector('.filter input[type="radio"]:checked').id === 'complete') {
		list.classList.add('hidden');
	}

	// Add Todo to LocalStorage
	saveLocalTodos(todoInput.value);
	// add the list to the todo items
	todoList.append(list);
	updateItemsCount(1);
}

// Updating the items count
function updateItemsCount(number) {
	itemsLeft.innerHTML = +itemsLeft.innerText + number;
}

// Remove Todo Item and update item count
function removeTodoItem(list) {
	list.remove();
	updateItemsCount(-1);
}

function filterTodoItems(id) {
	const allItems = todoList.querySelectorAll('li');

	switch (id) {
		case 'all':
			allItems.forEach((item) => {
				item.classList.remove('hidden');
			});
			break;
		case 'active':
			allItems.forEach((item) => {
				item.querySelector('input').checked ? item.classList.add('hidden') : item.classList.remove('hidden');
			});
			break;
		default:
			allItems.forEach((item) => {
				!item.querySelector('input').checked ? item.classList.add('hidden') : item.classList.remove('hidden');
			});
			break;
	}
}

// Looks at the number of todo items and updates the items left
itemsLeft.innerText = document.querySelectorAll('.list-item input[type="checkbox"]').length;

// Filter todo list items
document.querySelectorAll('.filter input').forEach((radio) => {
	radio.addEventListener('change', (e) => {
		filterTodoItems(e.target.id);
	});
});

// Local Storage
function saveLocalTodos(todo) {
	// Check if you already have list items
	let todos;
	if (localStorage.getItem('todos') === null) {
		// creates an array if we don't have any list items
		todos = [];
	} else {
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	todos.push(todo);
	localStorage.setItem('todos', JSON.stringify(todos));
}

function getTodos() {
	// Check if you already have list items
	let todos;
	if (localStorage.getItem('todos') === null) {
		// creates an array if we don't have any list items
		todos = [];
	} else {
		// gets the items form the localStorage
		todos = JSON.parse(localStorage.getItem('todos'));
	}

	todos.forEach(function (todo) {
		const list = document.createElement('li');
		list.classList.add('list-items');
		list.innerHTML = `
	<label class="list-item">
		<input type="checkbox" name="todoItem"/>
		<span class="checkmark"></span>
		<span class="text">${todo}</span>
	</label>
		<span class="remove"></span>
	`;

		if (document.querySelector('.filter input[type="radio"]:checked').id === 'complete') {
			list.classList.add('hidden');
		}

		// add the list to the todo items
		todoList.append(list);
		updateItemsCount(1);
	});
}

// Remove Local Storage
function removeLocalTodos(todo) {
	// Check if you already have list items
	let todos;
	if (localStorage.getItem('todos') === null) {
		// creates an array if we don't have any list items
		todos = [];
	} else {
		// gets the items form the localStorage
		todos = JSON.parse(localStorage.getItem('todos'));
	}
	// Remove the position of the element we're clicking on (getting the index within the array)
	// Get the index of the array
	// Grabbing the text of the array that is being stored
	const todoIndex = todo.children[0].innerText;
	// Splice allows us to specify what position we would like to remove an element - the second argument is how many elements - in this case 1
	todos.splice(todos.indexOf(todoIndex), 1);
	// Push it back to localStorage
	localStorage.setItem('todos', JSON.stringify(todos));
}
