/*
 * TaskGarden/taskPage/script.js 
 * Version: 1.0.2 (29 Feb 2024)
 * Authors: C. Jones, D. Campa
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

    /* if editing means adding a new task with 
    SOME identical fields, remove the old task first */
    tasks.splice(tasks.indexOf(task), 1);
    editButton.hidden = true;
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
        id: tasks.length,
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

        // Create edit button
        var editButton = document.createElement('button');
        editButton.style.display = 'inline';
        editButton.textContent = 'Edit';
        editButton.onclick = function() {
            taskEdit(task.id);
        }
        taskListDiv.appendChild(editButton);
    });
}