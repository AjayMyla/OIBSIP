/* =========================================================
   TASKFLOW — TO-DO WEB APP
   OIBSIP | Web Development | Level 1 | Task 3
   ========================================================= */


/* =========================
   ELEMENTS
========================= */

const taskForm = document.getElementById("taskForm");

const taskInput = document.getElementById("taskInput");

const pendingTasks = document.getElementById("pendingTasks");

const completedTasks = document.getElementById("completedTasks");

const pendingEmpty = document.getElementById("pendingEmpty");

const completedEmpty = document.getElementById("completedEmpty");

const pendingCount = document.getElementById("pendingCount");

const completedCount = document.getElementById("completedCount");


/* =========================
   DATA
========================= */

let tasks = JSON.parse(
    localStorage.getItem("taskflowTasks")
) || [];


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "taskflowTasks",
        JSON.stringify(tasks)
    );

}


/* =========================
   FORMAT TIME
========================= */

function formatTime(timestamp) {

    const date = new Date(timestamp);

    return date.toLocaleString([], {
        dateStyle: "medium",
        timeStyle: "short"
    });

}


/* =========================
   ADD TASK
========================= */

taskForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const text = taskInput.value.trim();


    if (!text) {

        taskInput.focus();

        return;

    }


    const newTask = {

        id: Date.now(),

        text: text,

        completed: false,

        createdAt: Date.now(),

        completedAt: null

    };


    tasks.unshift(newTask);


    saveTasks();

    renderTasks();


    taskInput.value = "";

    taskInput.focus();

});


/* =========================
   RENDER TASKS
========================= */

function renderTasks() {

    pendingTasks.innerHTML = "";

    completedTasks.innerHTML = "";


    const pending = tasks.filter(
        task => !task.completed
    );


    const completed = tasks.filter(
        task => task.completed
    );


    /* Counts */

    pendingCount.textContent =
        `${pending.length} ${pending.length === 1 ? "pending" : "pending"}`;


    completedCount.textContent =
        `${completed.length} ${completed.length === 1 ? "completed" : "completed"}`;


    /* Empty states */

    pendingEmpty.style.display =
        pending.length === 0 ? "block" : "none";


    completedEmpty.style.display =
        completed.length === 0 ? "block" : "none";


    /* Render pending */

    pending.forEach(task => {

        pendingTasks.appendChild(
            createTaskElement(task)
        );

    });


    /* Render completed */

    completed.forEach(task => {

        completedTasks.appendChild(
            createTaskElement(task)
        );

    });

}


/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const item = document.createElement("div");

    item.className =
        `task-item ${task.completed ? "completed" : ""}`;


    /* Check button */

    const checkButton = document.createElement("button");

    checkButton.className = "task-check";

    checkButton.setAttribute(
        "aria-label",
        task.completed
            ? "Mark task as pending"
            : "Mark task as complete"
    );

    checkButton.textContent = "✓";


    checkButton.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    /* Content */

    const content = document.createElement("div");

    content.className = "task-content";


    const text = document.createElement("p");

    text.className = "task-text";

    text.textContent = task.text;


    const time = document.createElement("p");

    time.className = "task-time";


    if (task.completed && task.completedAt) {

        time.textContent =
            `Completed ${formatTime(task.completedAt)}`;

    } else {

        time.textContent =
            `Added ${formatTime(task.createdAt)}`;

    }


    content.appendChild(text);

    content.appendChild(time);


    /* Actions */

    const actions = document.createElement("div");

    actions.className = "task-actions";


    /* Edit */

    const editButton = document.createElement("button");

    editButton.className =
        "action-button edit-button";

    editButton.textContent = "Edit";


    editButton.addEventListener(
        "click",
        () => editTask(task.id, content)
    );


    /* Complete / Undo */

    const completeButton = document.createElement("button");

    completeButton.className =
        "action-button complete-button";

    completeButton.textContent =
        task.completed ? "Undo" : "Complete";


    completeButton.addEventListener(
        "click",
        () => toggleTask(task.id)
    );


    /* Delete */

    const deleteButton = document.createElement("button");

    deleteButton.className =
        "action-button delete-button";

    deleteButton.textContent = "Delete";


    deleteButton.addEventListener(
        "click",
        () => deleteTask(task.id)
    );


    actions.appendChild(editButton);

    actions.appendChild(completeButton);

    actions.appendChild(deleteButton);


    /* Assemble */

    item.appendChild(checkButton);

    item.appendChild(content);

    item.appendChild(actions);


    return item;

}


/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {
        return;
    }


    task.completed = !task.completed;


    if (task.completed) {

        task.completedAt = Date.now();

    } else {

        task.completedAt = null;

    }


    saveTasks();

    renderTasks();

}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks = tasks.filter(
        task => task.id !== id
    );


    saveTasks();

    renderTasks();

}


/* =========================
   EDIT TASK
========================= */

function editTask(id, content) {

    const task = tasks.find(
        task => task.id === id
    );


    if (!task) {
        return;
    }


    const currentText = task.text;


    content.innerHTML = "";


    const input = document.createElement("input");

    input.type = "text";

    input.className = "edit-input";

    input.value = currentText;

    input.maxLength = 150;


    content.appendChild(input);


    input.focus();

    input.select();


    function saveEdit() {

        const newText = input.value.trim();


        if (newText) {

            task.text = newText;

        }


        saveTasks();

        renderTasks();

    }


    input.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                saveEdit();

            }


            if (event.key === "Escape") {

                renderTasks();

            }

        }
    );


    input.addEventListener(
        "blur",
        saveEdit
    );

}


/* =========================
   INITIAL LOAD
========================= */

renderTasks();