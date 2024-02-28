/*
 * TaskGarden/taskPage/script.js 
 * Version: 1.0.0 (27 Feb 2024)
 * Authors: C. Jones
 * Last Edit: C. Jones
 */

var tasks = []; // Array for storing task Objects.

// function taskAdd(): resets all values to 0 so that a new task can be added, and displays the taskAddBox.
function taskAdd() {
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('datetime').value = '';
    document.getElementById('diff').value = '';
    document.getElementById('taskAddBox').style.display = 'block';
}

// TODO@caj00017: Add functionality for task removal and editing.

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

// function closeTaskAddBox(): closes the taskAddBox. 
function closeTaskAddBox() {
    document.getElementById('taskAddBox').style.display = 'none';
}

// function saveData(): stores information from the taskAddBox in session storage and displays it to the user. 
// TODO@everyone: Find a way to add task information to local storage. In the future it can be stored server-side.
function saveData() {

    // Store input values into currentTask Object. 
    var currentTask = {
        id: tasks.length,
        title: document.getElementById('title').value,
        desc: document.getElementById('desc').value,
        datetime: document.getElementById('datetime').value,
        diff: document.getElementById('diff').value
    };

    // Push the current task to the tasks array.
    tasks.push(currentTask);

    // Close the popup.
    closeTaskAddBox();

    // Update the List to include the new Task.
    var outputDiv = document.getElementById('output');
    outputDiv.innerHTML = ''; // Clear previous content

    // TODO@caj00017: Find a way to implement this as a <ul> or <ol> intead of <p>. 
    tasks.forEach(function(task) {
        var p = document.createElement('p');

        p.textContent = 'Title: ' + task.title + 
        ' | Description: ' + task.desc +
        ' | Date & Time: ' + task.datetime +
        ' | Difficulty Level: ' + task.diff +
        ' | Points Available: TBD'; // TODO@everyone: Decide on the difficulty:points exchange rate.

        outputDiv.appendChild(p);

        // adding edit button for specific task
        var editButton = document.createElement('button');
        editButton.style.display = 'inline';
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            taskEdit(task.id);
        }
        outputDiv.appendChild(editButton);
    });
}