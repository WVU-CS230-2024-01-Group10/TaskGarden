/*
 * TaskGarden/taskPage/taskScript.js 
 * Version: 1.0.4 (04 Mar 2024)
 * Authors: C. Jones, D. Campa, E. Hall
 * Last Edit: C. Jones
 * TODO: Find a way to save points to localStorage without breaking it because apparently that happens idk why (C. Jones)
 */
 
var tasks = []; // Array for storing task Objects.
var points = 0;

// Cache DOM elements
var titleInput = document.getElementById('title');
var descInput = document.getElementById('desc');
var datetimeInput = document.getElementById('datetime');
var diffInput = document.getElementById('diff');
var priorityInput = document.getElementById('priority');
var taskAddBox = document.getElementById('taskAddBox');
var taskListDiv = document.getElementById('taskListDiv');
var pointCountDiv = document.getElementById('pointCount');

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
    priorityInput = '';
    taskAddBox.style.display = 'block';
}

// Note: Editing a task creates a new task. Would be wise to create another editTaskBox (supports ISP) - E Hall
// function taskEdit(): retrieves all values so that a task can be edited, and displays the taskAddBox.
function taskEdit(taskID) {
    var task = tasks.find(function(task) {
        return task.id === taskID;
    });

    titleInput.value = task.title;
    descInput.value = task.desc;
    datetimeInput.value = task.datetime;
    diffInput.value = task.diff;
    priorityInput.value = task.priority;
    taskAddBox.style.display = 'block';

    // mark the old task to be removed in updateList() by "blocking" it
    task.id = "BLOCK";

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
        title: titleInput.value,
        desc: descInput.value,
        datetime: datetimeInput.value,
        diff: diffInput.value,
        priority: document.getElementById('priority').value // I have no idea why priorityInput.value doesn't work here. (C. Jones)
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

    pointCountDiv.innerHTML = `<p>Your Points: ${points}</p>`;

    taskListDiv.innerHTML = ''; // Clear previous content

    // Create table and header
    var table = document.createElement('table');
    var header = table.insertRow(); 
    header.innerHTML = `
        <th>Title</th>
        <th>Description</th>
        <th>Date & Time</th>
        <th>Priority Level</th>
        <th>Difficulty Level</th>
        <th>Points Available</th>
        <th>Remove</th>
        <th>Edit</th>
        <th>Complete</th>
    `;

    tasks.forEach(function(task) {

        // Create a row for each task
        var row = table.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.desc}</td>
            <td>${task.datetime}</td>
            <td>${task.priority}</td>
            <td>${task.diff}</td>
            <td>${task.diff * 10}</td>
            <td><button class="remove-btn">Remove</button></td>
            <td><button class="edit-btn">Edit</button></td>
            <td><button class="complete-btn">Complete</button></td>
        `;

        if (task.id === "BLOCK") { row.style.display = 'none'; } // Do not display the blocked row.

        // Add event listener for remove button
        row.querySelector('.remove-btn').addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            updateList();
        });

        // Add event listener for edit button
        row.querySelector('.edit-btn').addEventListener('click', function() {
            taskEdit(task.id);
        });

        // Add event listener for edit button
        row.querySelector('.complete-btn').addEventListener('click', function() {
            points += task.diff * 10;
            tasks.splice(tasks.indexOf(task), 1);
            congratulate();
            updateList();
        });
    });

    taskListDiv.appendChild(table);

    flush();
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

// function flush(): removes blocked tasks from the array.
function flush() {
    tasks.forEach(function(task) {
        if (task.id === "BLOCK")
            tasks.splice(tasks.indexOf(task), 1);
    });
}

// function congratulate(): show congratulations message to user for completing a task
function congratulate() {
    const congratsElement = document.getElementById('congrats');
    congratsElement.classList.remove('hidden'); 
    congratsElement.classList.add('visible'); 

    setTimeout(function() {
        congratsElement.classList.remove('visible');
        congratsElement.classList.add('hidden');
    }, 2000);
}