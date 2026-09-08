/* =========================================================
   DAYMARK — TASK PLANNER
   OIBSIP | Web Development | Level 1 | Task 3
   ========================================================= */


/* =========================
   ELEMENTS
========================= */

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const priorityInput =
    document.getElementById("priorityInput");

const dateInput =
    document.getElementById("dateInput");

const taskList =
    document.getElementById("taskList");

const emptyState =
    document.getElementById("emptyState");

const emptyTitle =
    document.getElementById("emptyTitle");

const emptyText =
    document.getElementById("emptyText");

const searchInput =
    document.getElementById("searchInput");

const themeToggle =
    document.getElementById("themeToggle");

const clearCompleted =
    document.getElementById("clearCompleted");

const saveStatus =
    document.getElementById("saveStatus");


/* Statistics */

const totalCount =
    document.getElementById("totalCount");

const activeCount =
    document.getElementById("activeCount");

const doneCount =
    document.getElementById("doneCount");

const highCount =
    document.getElementById("highCount");


/* Progress */

const progressPercent =
    document.getElementById("progressPercent");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");


/* List */

const resultCount =
    document.getElementById("resultCount");

const listTitle =
    document.getElementById("listTitle");


/* =========================
   DATA
========================= */

let tasks =
    loadTasks();

let currentFilter =
    "all";


/* =========================
   LOAD TASKS
========================= */

function loadTasks() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "daymarkTasks"
                )
            );

        return Array.isArray(saved)
            ? saved
            : [];

    } catch {

        return [];

    }
}


/* =========================
   SAVE TASKS
========================= */

function saveTasks() {

    localStorage.setItem(
        "daymarkTasks",
        JSON.stringify(tasks)
    );

    saveStatus.textContent =
        "Saved just now";


    clearTimeout(
        saveTasks.timer
    );


    saveTasks.timer =
        setTimeout(() => {

            saveStatus.textContent =
                "Saved locally";

        }, 1400);
}


/* =========================
   FORMAT DATE
========================= */

function formatDate(timestamp) {

    return new Date(timestamp)
        .toLocaleString(
            [],
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
}


/* =========================
   FORMAT DUE DATE
========================= */

function formatDueDate(value) {

    if (!value) {

        return "";
    }


    const date =
        new Date(
            `${value}T00:00:00`
        );


    return date.toLocaleDateString(
        [],
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


/* =========================
   GET VISIBLE TASKS
========================= */

function getVisibleTasks() {

    const query =
        searchInput.value
            .trim()
            .toLowerCase();


    return tasks.filter(task => {

        const filterMatch =

            currentFilter === "all"

            ||

            (
                currentFilter === "active"
                &&
                !task.completed
            )

            ||

            (
                currentFilter === "completed"
                &&
                task.completed
            );


        const searchMatch =

            !query

            ||

            task.text
                .toLowerCase()
                .includes(query);


        return (
            filterMatch
            &&
            searchMatch
        );

    });
}


/* =========================
   RENDER
========================= */

function render() {

    const visible =
        getVisibleTasks();


    taskList.innerHTML =
        "";


    const active =
        tasks.filter(
            task =>
                !task.completed
        );


    const completed =
        tasks.filter(
            task =>
                task.completed
        );


    const high =
        active.filter(
            task =>
                task.priority === "high"
        );


    const percent =
        tasks.length
            ? Math.round(
                (
                    completed.length
                    /
                    tasks.length
                ) * 100
            )
            : 0;


    /* Statistics */

    totalCount.textContent =
        tasks.length;

    activeCount.textContent =
        active.length;

    doneCount.textContent =
        completed.length;

    highCount.textContent =
        high.length;


    /* Progress */

    progressPercent.textContent =
        `${percent}%`;

    progressBar.style.width =
        `${percent}%`;

    progressText.textContent =
        `${completed.length} of ${tasks.length} tasks completed`;


    /* List title */

    const titles = {

        all:
            "All tasks",

        active:
            "Active tasks",

        completed:
            "Completed tasks"

    };


    listTitle.textContent =
        titles[currentFilter];


    /* Result count */

    resultCount.textContent =
        `${visible.length} ${
            visible.length === 1
                ? "task"
                : "tasks"
        }`;


    /* Empty state */

    if (!visible.length) {

        emptyState.hidden =
            false;


        if (
            tasks.length
            &&
            searchInput.value.trim()
        ) {

            emptyTitle.textContent =
                "No matching tasks.";

            emptyText.textContent =
                "Try a different search term.";

        }

        else if (
            currentFilter ===
            "completed"
        ) {

            emptyTitle.textContent =
                "Nothing completed yet.";

            emptyText.textContent =
                "Finished tasks will appear here.";

        }

        else if (
            currentFilter ===
            "active"
        ) {

            emptyTitle.textContent =
                "You're all caught up.";

            emptyText.textContent =
                "There are no active tasks right now.";

        }

        else {

            emptyTitle.textContent =
                "Your list is clear.";

            emptyText.textContent =
                "Add a task above and make your next move.";

        }

    }

    else {

        emptyState.hidden =
            true;


        visible.forEach(task => {

            taskList.appendChild(
                createTaskElement(task)
            );

        });

    }
}


/* =========================
   CREATE TASK ELEMENT
========================= */

function createTaskElement(task) {

    const item =
        document.createElement(
            "article"
        );


    item.className =
        `task-item ${
            task.completed
                ? "completed"
                : ""
        }`;


    /* Check button */

    const check =
        document.createElement(
            "button"
        );


    check.className =
        "check-btn";


    check.type =
        "button";


    check.textContent =
        "✓";


    check.title =
        task.completed
            ? "Mark as active"
            : "Complete task";


    check.setAttribute(
        "aria-label",
        task.completed
            ? "Mark as active"
            : "Complete task"
    );


    check.addEventListener(
        "click",
        () =>
            toggleTask(task.id)
    );


    /* Main content */

    const main =
        document.createElement(
            "div"
        );


    main.className =
        "task-main";


    const text =
        document.createElement(
            "p"
        );


    text.className =
        "task-text";


    text.textContent =
        task.text;


    /* Metadata */

    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "task-meta";


    /* Priority */

    const priority =
        document.createElement(
            "span"
        );


    priority.className =
        `priority ${task.priority}`;


    priority.textContent =
        `${task.priority} priority`;


    meta.appendChild(
        priority
    );


    /* Created / completed time */

    const created =
        document.createElement(
            "span"
        );


    created.textContent =

        task.completed

            ? `Completed ${
                formatDate(
                    task.completedAt
                )
            }`

            : `Added ${
                formatDate(
                    task.createdAt
                )
            }`;


    meta.appendChild(
        created
    );


    /* Due date */

    if (task.dueDate) {

        const due =
            document.createElement(
                "span"
            );


        due.className =
            "due-date";


        due.textContent =
            `Due ${
                formatDueDate(
                    task.dueDate
                )
            }`;


        meta.appendChild(
            due
        );
    }


    main.append(
        text,
        meta
    );


    /* Actions */

    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "task-actions";


    /* Edit */

    const edit =
        document.createElement(
            "button"
        );


    edit.className =
        "action-btn";


    edit.type =
        "button";


    edit.textContent =
        "Edit";


    edit.addEventListener(
        "click",
        () =>
            editTask(
                task.id,
                main
            )
    );


    /* Complete / Undo */

    const complete =
        document.createElement(
            "button"
        );


    complete.className =
        "action-btn";


    complete.type =
        "button";


    complete.textContent =
        task.completed
            ? "Undo"
            : "Complete";


    complete.addEventListener(
        "click",
        () =>
            toggleTask(
                task.id
            )
    );


    /* Delete */

    const del =
        document.createElement(
            "button"
        );


    del.className =
        "action-btn delete";


    del.type =
        "button";


    del.textContent =
        "Delete";


    del.addEventListener(
        "click",
        () =>
            deleteTask(
                task.id
            )
    );


    actions.append(
        edit,
        complete,
        del
    );


    item.append(
        check,
        main,
        actions
    );


    return item;
}


/* =========================
   ADD TASK
========================= */

function addTask(event) {

    event.preventDefault();


    const text =
        taskInput.value.trim();


    if (!text) {

        taskInput.focus();

        return;
    }


    const now =
        Date.now();


    tasks.unshift({

        id:
            now +
            Math.random(),

        text:
            text,

        priority:
            priorityInput.value,

        dueDate:
            dateInput.value,

        completed:
            false,

        createdAt:
            now,

        completedAt:
            null

    });


    saveTasks();


    taskForm.reset();


    priorityInput.value =
        "medium";


    render();


    taskInput.focus();
}


/* =========================
   TOGGLE TASK
========================= */

function toggleTask(id) {

    const task =
        tasks.find(
            item =>
                item.id === id
        );


    if (!task) {

        return;
    }


    task.completed =
        !task.completed;


    task.completedAt =
        task.completed
            ? Date.now()
            : null;


    saveTasks();


    render();
}


/* =========================
   DELETE TASK
========================= */

function deleteTask(id) {

    tasks =
        tasks.filter(
            task =>
                task.id !== id
        );


    saveTasks();


    render();
}


/* =========================
   EDIT TASK
========================= */

function editTask(
    id,
    main
) {

    const task =
        tasks.find(
            item =>
                item.id === id
        );


    if (!task) {

        return;
    }


    const oldText =
        task.text;


    main.innerHTML =
        "";


    const input =
        document.createElement(
            "input"
        );


    input.className =
        "edit-input";


    input.type =
        "text";


    input.value =
        oldText;


    input.maxLength =
        150;


    main.appendChild(
        input
    );


    input.focus();


    input.select();


    let saved =
        false;


    function finish() {

        if (saved) {

            return;
        }


        saved =
            true;


        const value =
            input.value.trim();


        if (value) {

            task.text =
                value;
        }


        saveTasks();


        render();
    }


    input.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Enter"
            ) {

                finish();
            }


            if (
                event.key ===
                "Escape"
            ) {

                render();
            }

        }
    );


    input.addEventListener(
        "blur",
        finish
    );
}


/* =========================
   FILTER
========================= */

function setFilter(filter) {

    currentFilter =
        filter;


    document
        .querySelectorAll(
            ".filter-btn"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.filter ===
                filter
            );

        });


    render();
}


/* =========================
   THEME
========================= */

function setTheme(theme) {

    document.body.classList.toggle(
        "dark",
        theme === "dark"
    );


    localStorage.setItem(
        "daymarkTheme",
        theme
    );


    themeToggle.textContent =
        theme === "dark"
            ? "☾"
            : "☼";


    themeToggle.setAttribute(
        "aria-label",
        theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode"
    );


    themeToggle.title =
        theme === "dark"
            ? "Switch to light mode"
            : "Switch to dark mode";
}


/* =========================
   EVENT LISTENERS
========================= */

taskForm.addEventListener(
    "submit",
    addTask
);


searchInput.addEventListener(
    "input",
    render
);


/* Filter buttons */

document
    .querySelectorAll(
        ".filter-btn"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () =>
                setFilter(
                    button.dataset.filter
                )
        );

    });


/* Clear completed */

clearCompleted.addEventListener(
    "click",
    () => {

        if (
            !tasks.some(
                task =>
                    task.completed
            )
        ) {

            return;
        }


        tasks =
            tasks.filter(
                task =>
                    !task.completed
            );


        saveTasks();


        render();

    }
);


/* Theme */

themeToggle.addEventListener(
    "click",
    () => {

        setTheme(
            document.body.classList.contains(
                "dark"
            )
                ? "light"
                : "dark"
        );

    }
);


/* =========================
   INITIAL LOAD
========================= */

const savedTheme =
    localStorage.getItem(
        "daymarkTheme"
    );


setTheme(
    savedTheme === "dark"
        ? "dark"
        : "light"
);


render();