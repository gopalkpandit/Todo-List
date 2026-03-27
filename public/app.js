
const textBox = document.getElementById('newTodoInput');
const todoList = document.querySelector('.todo-list');

  async function addTodo() {
    try {
        // Get the text from the input box
        const taskText = textBox.value;
        console.log(taskText);
        // Prevent sending empty todos
        if (!taskText.trim()) {
        alert('Please enter a todo!');
        return;
        }

        const response = await fetch('http://127.0.0.1:3000/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ "task": taskText })
        });

        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.status);
        }

        const data = await response.text();
        console.log('Todo added:', data);

        // Clear the input after adding
        textBox.value = '';

    } catch (error) {
        console.error('Error:', error);
    }

    loadTodo();
}

async function loadTodo() {
    try {
        const response = await fetch('http://127.0.0.1:3000/todos', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
        throw new Error('Network response was not ok ' + response.status);
        }

        const data = await response.json();
        renderTodos(data);
    } catch (error) {
        console.error('Error:', error);
    }
}


function renderTodos(data) {
  // Clear existing items
  todoList.innerHTML = '';

  data.forEach(todo => {
    const li = document.createElement('li');
    
    // Show the task text
    li.textContent = todo.task;

    // Optional: style completed tasks
    if (todo.completed) {
      li.style.textDecoration = 'line-through';
      li.style.color = 'gray';
    }

    todoList.appendChild(li);
  });
}


document.addEventListener('DOMContentLoaded', async() => {
  console.log('DOM fully loaded');
  loadTodo();
});
