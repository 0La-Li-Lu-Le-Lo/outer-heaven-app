let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

document.getElementById("task-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const taskInput = document.getElementById("task-input");
  const prioritySelect = document.getElementById("priority-select");
  const dueDateInput = document.getElementById("due-date");

  const task = {
    text: taskInput.value,
    priority: prioritySelect.value,
    dueDate: dueDateInput.value,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  taskInput.value = "";
  dueDateInput.value = "";
});

function renderTasks() {
  const list = document.getElementById("task-list");
  list.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = `${task.text} [${task.priority}]`;
    taskText.classList.add(`priority-${task.priority.toLowerCase()}`);

    if (task.dueDate) {
      const dueSpan = document.createElement("span");
      dueSpan.textContent = ` (Due: ${task.dueDate})`;
      dueSpan.style.marginLeft = "8px";
      li.appendChild(dueSpan);

      // Highlight overdue
      const today = new Date().toISOString().split("T")[0];
      if (task.dueDate < today) {
        dueSpan.style.color = "red";
      }
    }

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("task-buttons");

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.onclick = () => editTask(index);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    };

    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(delBtn);

    li.prepend(taskText);
    li.appendChild(btnContainer);
    list.appendChild(li);
  });
}

function editTask(index) {
  const newText = prompt("Edit task:", tasks[index].text);
  if (newText !== null && newText.trim() !== "") {
    tasks[index].text = newText.trim();
    saveTasks();
    renderTasks();
  }
}

function sortTasks(type) {
  if (type === "priority") {
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  } else if (type === "dueDate") {
    tasks.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  }
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

renderTasks();

// 🔔 Notifications for upcoming tasks
if ("Notification" in window && Notification.permission !== "denied") {
  Notification.requestPermission();
}

function checkDueTasks() {
  const today = new Date().toISOString().split("T")[0];
  tasks.forEach(task => {
    if (task.dueDate === today) {
      new Notification("Task Due Today!", { body: task.text });
    }
  });
}

setInterval(checkDueTasks, 60 * 1000); // check every minute