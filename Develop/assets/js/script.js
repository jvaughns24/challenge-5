// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    let id = nextId;
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
    return id;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let taskCard = $('<div class="task-card card mb-3"></div>');
    taskCard.attr('data-id', task.id);
    taskCard.append(`<div class="card-body">
                        <h3 class="card-title">${task.title}</h3>
                        <p class="card-text">${task.description}</p>
                        <p class="card-text">Due: ${task.dueDate}</p>
                        <button class="btn btn-danger delete-btn">Delete</button> </div>`);
      // Color coding based on due date
    let dueDate = dayjs(task.dueDate);
    let today = dayjs();
    if (dueDate.isBefore(today)) {
        taskCard.addClass('bg-danger text-white');
    } else if (dueDate.diff(today, 'day') <= 3) {
        taskCard.addClass('bg-warning');
    }

    taskCard.draggable({
        revert: "invalid",
        helper: "clone"
    });

    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();

    taskList.forEach(task => {
        let taskCard = createTaskCard(task);
        $(`#${task.status}-cards`).append(taskCard);
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $('#task-title').val();
    let description = $('#task-desc').val();
    let dueDate = $('#task-due').val();

    if (title && description && dueDate) {
        let task = {
            id: generateTaskId(),
            title: title,
            description: description,
            dueDate: dueDate,
            status: "todo"
        };
        taskList.push(task);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        renderTaskList();
        $('#task-form')[0].reset();
        $('#formModal').modal('hide');
    } else {
        alert("Please fill out all fields.");
    }
}


// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
    let taskId = $(event.target).closest('.task-card').attr('data-id');
    taskList = taskList.filter(task => task.id != taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    let taskId = ui.helper.attr('data-id');
    let newStatus = $(this).attr('id').split('-')[0];
    taskList.forEach(task => {
        if (task.id == taskId) {
            task.status = newStatus;
        }
    });
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $('#task-form').on('submit', handleAddTask);
    $(document).on('click', '.delete-btn', handleDeleteTask);

    $('.lane').droppable({
        accept: '.task-card',
        drop: handleDrop
    });

    $('#task-due').datepicker();
});