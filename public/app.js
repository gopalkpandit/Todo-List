
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

async function updateTodo(id){
  try{
    const response = await fetch(`http://127.0.0.1:3000/todos/${id}`,{
      method : "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({})
    });
    const data = await response.text();
    console.log(data);
  } catch (error){
    console.error(error);
  }
}


function renderTodos(data) {
  todoList.innerHTML = '';

  data.forEach(todo => {
    const li = document.createElement('li');
    li.dataset.id = todo.id;
    const label = document.createElement("label");


    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

     

    // Add strike-through when checked
    if (todo.completed) {
      label.style.textDecoration = 'line-through';
      label.style.color = 'gray';
    }

    // toggle style when checkbox clicked
    checkbox.addEventListener("change", function () {
      const id = li.dataset.id;
      console.log(id);
      if (this.checked) {
        label.style.textDecoration = 'line-through';
        label.style.color = 'gray';
        console.log(data);
        updateTodo(id);
      } else {
        label.style.textDecoration = 'none';
        label.style.color = 'black';
      }
    }); 

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + todo.task));

    li.appendChild(label);
    todoList.appendChild(li);
  });
}


document.addEventListener('DOMContentLoaded', async() => {
  console.log('DOM fully loaded');
  loadTodo();
});
