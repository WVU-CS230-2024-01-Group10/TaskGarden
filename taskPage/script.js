/*
 * TaskGarden/taskPage/script.js 
 * Version: 1.0.4 (04 Mar 2024)
 * Authors: C. Jones, D. Campa, E. Hall
 * Last Edit: C. Jones
 * TODO: Find a way for 'editing' a task to actually 'edit' the task instead of just creating a new one. 
 */
 
var tasks = []; // Array for storing task Objects.

// Cache DOM elements
var titleInput = document.getElementById('title');
var descInput = document.getElementById('desc');
var datetimeInput = document.getElementById('datetime');
var diffInput = document.getElementById('diff');
var taskAddBox = document.getElementById('taskAddBox');
var taskListDiv = document.getElementById('taskListDiv');

if (localStorage.getItem("tasks")) {                
    tasks = JSON.parse(localStorage.getItem("tasks"));
    updateList();
 }

// saves all tasks to local storage
function saveTask() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.addEventListener('DOMContentLoaded', function() {
    updateList();
    console.log(tasks);
});

document.getElementById("addTaskButton").addEventListener("mouseover", function () {
    // Indicate to the user that this button is interactive
    this.style.backgroundColor = "darkgreen";
    this.style.cursor = "pointer";
});

document.getElementById("addTaskButton").addEventListener("mouseout", function () {
    this.style.backgroundColor = ""; // Reset to the default background color
});

// function showTaskAddBox(): resets all values to 0 so that a new task can be added, and displays the taskAddBox.
function showTaskAddBox() {
    titleInput.value = '';
    descInput.value = '';
    datetimeInput.value = '';
    diffInput.value = '';
    document.getElementById('priority').value = '';
    taskAddBox.style.display = 'block';
}

// Bug: Editing a task creates a new task. Would be wise to create another editTaskBox (supports ISP)
// function taskEdit(): retrieves all values so that a task can be edited, and displays the taskAddBox.
function taskEdit(taskID) {
    var task = tasks.find(function(task) {
        return task.id === taskID;
    });

    document.getElementById('title').value = task.title;
    document.getElementById('desc').value = task.desc;
    document.getElementById('datetime').value = task.datetime;
    document.getElementById('diff').value = task.diff;
    document.getElementById('taskAddBox').style.display = 'block';
}

// function close(): closes the box for adding, editing, or removing. 
function close(id) {
    document.getElementById(id).style.display = 'none';
}

// alternative function closeTaskAddBox() for removing *specifically* the taskAddBox. 
// Note: I'm trying to figure out how to use close() instead of this method, for some reason I can't get it to work. (C. Jones)
function closeTaskAddBox() {
    taskAddBox.style.display = 'none';
}

// function addTask(): Adds a task from the popup form to the task list.
function addTask() {

    // Store input values into currentTask Object. 
    var currentTask = {
        // Note: Changed ID attribute to be a unique integer 0-999. The same ID being generated twice is possible but extremely improbable. (C. Jones)
        id: Math.trunc(Math.random() * 999),
        title: document.getElementById('title').value,
        desc: document.getElementById('desc').value,
        datetime: document.getElementById('datetime').value,
        diff: document.getElementById('diff').value
    };

    // Push the current task to the tasks array.
    tasks.push(currentTask);
    console.log(tasks);

    // Close the taskAddBox.
    close('taskAddBox');

    // Update the list.
    updateList();
}

// function updateList(): Refreshes the list of tasks at the bottom of the page. 
function updateList() {

    taskListDiv.innerHTML = ''; // Clear previous content

    // Create table and header
    var table = document.createElement('table');
    var header = table.insertRow(); 
    header.insertCell().textContent = "Title";
    header.insertCell().textContent = "Description";
    header.insertCell().textContent = "Date & Time";
    header.insertCell().textContent = "Difficulty Level";
    header.insertCell().textContent = "Points Available";
    header.insertCell().textContent = "Remove";
    header.insertCell().textContent = "Edit";

    // TODO@caj00017: Find a way to implement this as a <ul> or <ol> intead of <p>. 
    tasks.forEach(function(task) {

        // Create a row for each task
        var row = table.insertRow();
        row.insertCell().textContent = task.title;
        row.insertCell().textContent = task.desc;
        row.insertCell().textContent = task.datetime;
        row.insertCell().textContent = task.diff;
        row.insertCell().textContent = "TBD";

        // Create remove button
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            updateList();
        });

        // Add event listener for edit button
        row.querySelector('.edit-btn').addEventListener('click', function() {
            taskEdit(task.id);
        });
    });

    taskListDiv.appendChild(table);

    saveTask();
}

function updateTaskDifficulty() {
    var range = document.getElementById("diff");
    var output = document.getElementById("diffOutput");
    output.innerHTML = range.value;

    range.classList.remove("value-2", "value-3");
    range.classList.add("value-" + range.value);
}

function updateTaskPriority() {
var range = document.getElementById("priority");
var output = document.getElementById("priorityOutput");
output.innerHTML = range.value;

range.classList.remove("value-2", "value-3");
range.classList.add("value-" + range.value);
}