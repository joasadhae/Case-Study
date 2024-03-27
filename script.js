document.addEventListener('DOMContentLoaded', function () {
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');

  // Function to add task to the list
  function addTaskToUI(taskText, taskId) {
    const li = document.createElement('li');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', function () {
      // Mark task as completed or not completed based on checkbox state
      updateTaskCompletion(taskId, this.checked);
    });

    const label = document.createElement('label');
    label.textContent = taskText;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function () {
      deleteTask(taskId);
      li.remove();
    });

    li.appendChild(checkbox);
    li.appendChild(label);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
  }

  function updateTaskCompletion(taskId, completed) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed: completed }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Task completion status updated successfully');
        } else {
          console.error('Error updating task completion status');
        }
      })
      .catch((error) =>
        console.error('Error updating task completion status:', error)
      );
  }

  // Function to fetch tasks from the database and display them on the page
  function displayTasksFromDB() {
    fetch('http://localhost:3000/tasks')
      .then((response) => response.json())
      .then((data) => {
        data.forEach((task) => {
          addTaskToUI(task.task, task.id);
        });
      })
      .catch((error) => console.error('Error fetching tasks:', error));
  }

  // Event listener for form submission
  taskForm.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    const taskText = taskInput.value.trim(); // Trim whitespace from input

    if (taskText !== '') {
      // Add task to the database
      fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task: taskText }),
      })
        .then((response) => response.json())
        .then((data) => {
          addTaskToUI(taskText, data.id); // Add task to the UI
        })
        .catch((error) => console.error('Error adding task:', error));

      taskInput.value = ''; // Clear input field
    }
  });

  // Function to delete task from the database
  function deleteTask(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          console.log('Task deleted successfully');
        } else {
          console.error('Error deleting task');
        }
      })
      .catch((error) => console.error('Error deleting task:', error));
  }

  // Display tasks from the database on page load
  displayTasksFromDB();
});
