/*
 * TaskGarden/taskPage/script.js
 * Version: 1.0.3 (1 Mar 2024)
 * Authors: C. Jones, D. Campa
 * Last Edit: C. Jones
 */

tasks = [];

document.addEventListener('DOMContentLoaded', function() {
    updateList();
});

// Cache DOM elements
var titleInput = document.getElementById('title');
var descInput = document.getElementById('desc');
var datetimeInput = document.getElementById('datetime');
var diffInput = document.getElementById('diff');
var taskAddBox = document.getElementById('taskAddBox');
var taskListDiv = document.getElementById('taskListDiv');

// function showTaskAddBox(): resets all values and displays the taskAddBox.
function showTaskAddBox() {
    titleInput.value = '';
    descInput.value = '';
    datetimeInput.value = '';
    diffInput.value = '';
    taskAddBox.style.display = 'block';
}

// function taskEdit(): retrieves all values and displays the taskAddBox.
function taskEdit(taskID) {
    var task = tasks.find(function(task) {
        return task.id === taskID;
    });

    titleInput.value = task.title;
    descInput.value = task.desc;
    datetimeInput.value = task.datetime;
    diffInput.value = task.diff;
    taskAddBox.style.display = 'block';
}

function closeTaskAddBox() {
    taskAddBox.style.display = 'none';
}

// function addTask(): Adds a task from the popup form to the task list.
function addTask() {
    var currentTask = {
        id: tasks.length,
        title: titleInput.value,
        desc: descInput.value,
        datetime: datetimeInput.value,
        diff: diffInput.value
    };

        // Remove the old task if it exists
    if (currentTask.id < tasks.length) {
        tasks.splice(currentTask.id, 1);
    }

    tasks.push(currentTask);
    taskAddBox.style.display = 'none';
    updateList();
}

// function updateList(): Refreshes the list of tasks.
function updateList() {
    taskListDiv.innerHTML = ''; // Clear previous content

    var table = document.createElement('table');
    var header = table.insertRow(); 
    header.innerHTML = `
        <th>Title</th>
        <th>Description</th>
        <th>Date & Time</th>
        <th>Difficulty Level</th>
        <th>Points Available</th>
        <th>Remove</th>
        <th>Edit</th>
    `;

    tasks.forEach(function(task) {
        var row = table.insertRow();
        row.innerHTML = `
            <td>${task.title}</td>
            <td>${task.desc}</td>
            <td>${task.datetime}</td>
            <td>${task.diff}</td>
            <td>TBD</td>
            <td><button class="remove-btn">Remove</button></td>
            <td><button class="edit-btn">Edit</button></td>
        `;

        // Add event listener for remove button
        row.querySelector('.remove-btn').addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            updateList();
        });

        // Add event listener for edit button
        row.querySelector('.edit-btn').addEventListener('click', function() {
            taskEdit(task.id);
        });

        console.log(tasks);
    });

    taskListDiv.appendChild(table);
}
