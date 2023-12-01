// Selecting elements from the DOM
const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

// Initializing variables
let editId,
    isEditTask = false,
    // Retrieving tasks from local storage
    todos = JSON.parse(localStorage.getItem("todo-list"));

// Event listeners for filter buttons
filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        // Updating active filter and displaying tasks accordingly
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

// Initial display of tasks with "all" filter
showTodo("all");

// Function to display tasks based on the selected filter
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            // Generating HTML for each task based on the filter
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    // Displaying tasks or a message if no tasks are present
    taskBox.innerHTML =
        liTag || `<span>You don't have any task here</span>`;
    
    // Managing the "Clear All" button visibility
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length
        ? clearAll.classList.remove("active")
        : clearAll.classList.add("active");
    
    // Managing overflow for task list
    taskBox.offsetHeight >= 300
        ? taskBox.classList.add("overflow")
        : taskBox.classList.remove("overflow");
}

// Function to display the context menu for a task
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    // Event listener to hide the menu when clicking outside
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Function to update the status (completed/pending) of a task
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    // Saving the updated tasks to local storage
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// Function to prepare for editing a task
function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// Function to delete a task
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    // Saving the updated tasks to local storage
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Event listener for the "Clear All" button
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    // Saving the updated tasks to local storage
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

// Event listener for user input (adding/editing tasks)
taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            // Adding a new task to the list
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {        
            // Editing an existing task
            isEditTask = false;
            todos[editId].name = userTask;
        }
        // Clearing the input field and saving the updated tasks to local storage
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});
