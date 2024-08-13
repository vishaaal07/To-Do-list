document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const editModal = document.getElementById("editModal");
  const editInput = document.getElementById("editInput");
  const saveEdit = document.getElementById("saveEdit");
  const closeModal = document.querySelector(".close");
  let currentEditId = null;

  function renderTasks() {
    taskList.innerHTML = "";
    const tasks = getTasks();
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
                ${task.text}
                <div>
                    <button class="edit-btn" data-id="${task.id}">Edit</button>
                    <button class="delete-btn" data-id="${task.id}">Delete</button>
                </div>
            `;
      taskList.appendChild(li);
    });
  }

  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  }

  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText) {
      const tasks = getTasks();
      if (currentEditId === null) {
        tasks.push({ id: Date.now(), text: taskText });
      } else {
        const task = tasks.find((task) => task.id === currentEditId);
        if (task) {
          task.text = taskText;
        }
        currentEditId = null;
      }
      saveTasks(tasks);
      taskInput.value = "";
      renderTasks();
    }
  });

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("edit-btn")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      const tasks = getTasks();
      const task = tasks.find((task) => task.id === id);
      if (task) {
        editInput.value = task.text;
        currentEditId = id;
        editModal.style.display = "block";
      }
    } else if (e.target.classList.contains("delete-btn")) {
      const id = parseInt(e.target.getAttribute("data-id"));
      const tasks = getTasks().filter((task) => task.id !== id);
      saveTasks(tasks);
      renderTasks();
    }
  });

  saveEdit.addEventListener("click", () => {
    const newText = editInput.value.trim();
    if (newText && currentEditId !== null) {
      const tasks = getTasks();
      const task = tasks.find((task) => task.id === currentEditId);
      if (task) {
        task.text = newText;
        saveTasks(tasks);
        editModal.style.display = "none";
        renderTasks();
        currentEditId = null;
      }
    }
  });

  closeModal.addEventListener("click", () => {
    editModal.style.display = "none";
    currentEditId = null;
  });

  window.onclick = (event) => {
    if (event.target === editModal) {
      editModal.style.display = "none";
      currentEditId = null;
    }
  };

  renderTasks();
});
