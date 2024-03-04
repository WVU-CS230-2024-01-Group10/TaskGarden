/*
 * TaskGarden/taskPage/script.js 
 * Version: 1.0.4 (04 Mar 2024)
 * Authors: C. Jones, D. Campa, E. Hall
 * Last Edit: C. Jones
 */
 
var tasks = []; // Array for storing task Objects.

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
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('datetime').value = '';
    document.getElementById('diff').value = '';
    document.getElementById('priority').value = '';
    document.getElementById('taskAddBox').style.display = 'block';
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
    document.getElementById('priority').value = task.priority;
    document.getElementById('taskAddBox').style.display = 'block';
}

// function close(): closes the box for adding, editing, or removing. 
function close(id) {
    document.getElementById(id).style.display = 'none';
}

// alternative function closeTaskAddBox() for removing *specifically* the taskAddBox. 
// Note: I'm trying to figure out how to use close() instead of this method, for some reason I can't get it to work. (C. Jones)
function closeTaskAddBox() {
    document.getElementById('taskAddBox').style.display = 'none';
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
        diff: document.getElementById('diff').value,
        priority: document.getElementById('priority').value
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
// TODO@everyone: Find a way to add task information to local storage. In the future it can be stored server-side.
function updateList() {

    var taskListDiv = document.getElementById('taskListDiv');
    taskListDiv.innerHTML = ''; // Clear previous content

    // Create table and header
    var table = document.createElement('table');
    var header = table.insertRow(); 
    header.insertCell().textContent = "Title";
    header.insertCell().textContent = "Description";
    header.insertCell().textContent = "Date & Time";
    header.insertCell().textContent = "Difficulty Level";
    header.insertCell().textContent = "Priority";
    header.insertCell().textContent = "Points Available";
    header.insertCell().textContent = "Remove";
    header.insertCell().textContent = "Edit";

    // TODO@caj00017: Find a way to implement this as a <ul> or <ol> intead of <p>. 
    tasks.forEach(function(task) {

        var row = table.insertRow();
        row.insertCell().textContent = task.title;
        row.insertCell().textContent = task.desc;
        row.insertCell().textContent = task.datetime;
        row.insertCell().textContent = task.diff;
        row.insertCell().textContent = task.priority;
        row.insertCell().textContent = "TBD";

        // Create remove button
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            removeButton.hidden = true; 
            updateList();
        } );
        row.insertCell().appendChild(removeButton);


        // Create edit button
        var editButton = document.createElement('button');
        editButton.style.display = 'inline';
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            taskEdit(task.id);
        }
        row.insertCell().appendChild(editButton);
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