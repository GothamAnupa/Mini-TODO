const API_URL = "http://127.0.0.1:8000";

// HTML elements
const taskTitleInput = document.getElementById("taskTitle");
const addTaskButton = document.getElementById("addTaskButton");
const taskList = document.getElementById("taskList");
const upcomingTaskList = document.getElementById("upcomingTaskList");


// ==========================================
// LOAD TODAY'S TASKS
// ==========================================

async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/`);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();

        renderTasks(tasks, taskList);

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


// ==========================================
// LOAD UPCOMING TASKS
// ==========================================

async function loadUpcomingTasks() {
    try {
        const response = await fetch(`${API_URL}/tasks/upcoming`);

        if (!response.ok) {
            throw new Error("Failed to load upcoming tasks");
        }

        const tasks = await response.json();

        renderTasks(tasks, upcomingTaskList);

    } catch (error) {
        console.error("Error loading upcoming tasks:", error);
    }
}


// ==========================================
// RENDER TASKS
// ==========================================

function renderTasks(tasks, container) {

    container.innerHTML = "";

    if (tasks.length === 0) {
        container.innerHTML = `
            <p class="no-tasks">No tasks found.</p>
        `;
        return;
    }

    tasks.forEach(task => {

        const taskElement = document.createElement("div");

        taskElement.classList.add("task");

        if (task.completed) {
            taskElement.classList.add("completed");
        }


        // Task HTML
        taskElement.innerHTML = `
            <input
                type="checkbox"
                class="task-checkbox"
                ${task.completed ? "checked" : ""}
            >

            <div class="task-content">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-description">
                    ${escapeHTML(task.description || "")}
                </div>

            </div>

            <div class="task-time">
                ${formatDate(task.due_date)}
            </div>

            <button class="edit-button">
                Edit
            </button>

            <button class="delete-button">
                Delete
            </button>
        `;


        // ==========================================
        // COMPLETE / UNCOMPLETE
        // ==========================================

        const checkbox =
            taskElement.querySelector(".task-checkbox");

        checkbox.addEventListener("change", () => {

            updateTask(task.id, {
                completed: checkbox.checked
            });

        });


        // ==========================================
        // EDIT
        // ==========================================

        const editButton =
            taskElement.querySelector(".edit-button");

        editButton.addEventListener("click", () => {

            editTask(task);

        });


        // ==========================================
        // DELETE
        // ==========================================

        const deleteButton =
            taskElement.querySelector(".delete-button");

        deleteButton.addEventListener("click", () => {

            deleteTask(task.id);

        });


        container.appendChild(taskElement);

    });
}


// ==========================================
// ADD TASK
// ==========================================

async function addTask() {

    const title = taskTitleInput.value.trim();

    if (!title) {
        alert("Please enter a task.");
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/tasks/`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: title
                })
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            console.error("Backend error:", errorData);

            throw new Error("Failed to create task");
        }


        const newTask = await response.json();

        console.log("Task created:", newTask);


        // Clear input
        taskTitleInput.value = "";


        // Reload tasks
        await loadTasks();
        await loadUpcomingTasks();


    } catch (error) {

        console.error("Error creating task:", error);

    }
}


// ==========================================
// EDIT TASK
// ==========================================

async function editTask(task) {

    const newTitle = prompt(
        "Edit task:",
        task.title
    );


    // User clicked Cancel
    if (newTitle === null) {
        return;
    }


    const updatedTitle = newTitle.trim();


    if (!updatedTitle) {

        alert("Task title cannot be empty.");

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/tasks/${task.id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    title: updatedTitle
                })
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            console.error("Backend error:", errorData);

            throw new Error("Failed to edit task");
        }


        const updatedTask = await response.json();

        console.log("Task updated:", updatedTask);


        // Reload tasks
        await loadTasks();
        await loadUpcomingTasks();


    } catch (error) {

        console.error("Error editing task:", error);

    }
}


// ==========================================
// UPDATE TASK
// ==========================================

async function updateTask(taskId, data) {

    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            console.error("Backend error:", errorData);

            throw new Error("Failed to update task");
        }


        const updatedTask = await response.json();

        console.log("Task updated:", updatedTask);


        // Reload tasks
        await loadTasks();
        await loadUpcomingTasks();


    } catch (error) {

        console.error("Error updating task:", error);

    }
}


// ==========================================
// DELETE TASK
// ==========================================

async function deleteTask(taskId) {

    const confirmed = confirm(
        "Are you sure you want to delete this task?"
    );


    if (!confirmed) {
        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/tasks/${taskId}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {

            const errorData = await response.json();

            console.error("Backend error:", errorData);

            throw new Error("Failed to delete task");
        }


        console.log("Task deleted:", taskId);


        // Reload tasks
        await loadTasks();
        await loadUpcomingTasks();


    } catch (error) {

        console.error("Error deleting task:", error);

    }
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });
}


// ==========================================
// PREVENT HTML INJECTION
// ==========================================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ==========================================
// ADD BUTTON CLICK
// ==========================================

addTaskButton.addEventListener("click", addTask);


// ==========================================
// ENTER KEY
// ==========================================

taskTitleInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        addTask();
    }

});


// ==========================================
// INITIAL LOAD
// ==========================================

loadTasks();
loadUpcomingTasks();