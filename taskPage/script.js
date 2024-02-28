/*
 * TaskGarden/taskPage/script.js 
 * Version: 1.0.1 (28 Feb 2024)
 * Authors: C. Jones
 * Last Edit: C. Jones
 */

var tasks = []; // Array for storing task Objects.

// function showTaskAddBox(): resets all values to 0 so that a new task can be added, and displays the taskAddBox.
function showTaskAddBox() {
    document.getElementById('title').value = '';
    document.getElementById('desc').value = '';
    document.getElementById('datetime').value = '';
    document.getElementById('diff').value = '';
    document.getElementById('taskAddBox').style.display = 'block';
}

// TODO@caj00017: Add functionality for task removal and editing.

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
        title: document.getElementById('title').value,
        desc: document.getElementById('desc').value,
        datetime: document.getElementById('datetime').value,
        diff: document.getElementById('diff').value
    };

    // Push the current task to the tasks array.
    tasks.push(currentTask);

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

    // TODO@caj00017: Find a way to implement this as a <ul> or <ol> intead of <p>. 
    tasks.forEach(function(task) {
        // Display task
        var p = document.createElement('p');
        p.textContent = 'Title: ' + task.title + 
        ' | Description: ' + task.desc +
        ' | Date & Time: ' + task.datetime +
        ' | Difficulty Level: ' + task.diff +
        ' | Points Available: TBD'; // TODO@everyone: Decide on the difficulty:points exchange rate.
        taskListDiv.appendChild(p);

        // Create remove button
        var removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', function() {
            tasks.splice(tasks.indexOf(task), 1);
            removeButton.hidden = true; 
            updateList();
        } );
        taskListDiv.appendChild(removeButton);
    });
}