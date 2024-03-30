import React, { useState, useEffect } from 'react';
import '../styles/taskStyles.css';

/*Currently able to add, edit, remove, and complete tasks, BUT they don't save to localStorage. */
function TaskPage() {
    const [tasks, setTasks] = useState([]);
    const [points, setPoints] = useState(0);
    const [titleInput, setTitleInput] = useState('');
    const [descInput, setDescInput] = useState('');
    const [datetimeInput, setDatetimeInput] = useState('');
    const [diffInput, setDiffInput] = useState(2); // Default difficulty
    const [priorityInput, setPriorityInput] = useState(2); // Default priority
    const [taskAddBoxVisible, setTaskAddBoxVisible] = useState(false);

    useEffect(() => {
        const storedTasks = localStorage.getItem("tasks");
        if (storedTasks) {
            setTasks(JSON.parse(storedTasks));
        }
    }, []);

    useEffect(() => {
        const saveTask = () => {
            localStorage.setItem("tasks", JSON.stringify(tasks));
        };
    
        saveTask(); // Call saveTask inside useEffect
    
        return () => {
            // Cleanup function (optional) if needed
        };
    }, [tasks]);

    const showTaskAddBox = () => {
        setTitleInput('');
        setDescInput('');
        setDatetimeInput('');
        setDiffInput(2); // Reset to default difficulty
        setPriorityInput(2); // Reset to default priority
        setTaskAddBoxVisible(true);
    };

    const closeTaskAddBox = () => {
        setTaskAddBoxVisible(false);
    };

    const addTask = () => {
        const newTask = {
            id: Math.trunc(Math.random() * 999),
            title: titleInput,
            desc: descInput,
            datetime: datetimeInput,
            diff: diffInput,
            priority: priorityInput
        };

        if (newTask.title === "") { newTask.title = "Unnamed Task" };
        if (newTask.desc === "") { newTask.desc = "This task has no description" };

        setTasks(prevTasks => {
            const updatedTasks = [...prevTasks, newTask];
            localStorage.setItem("tasks", JSON.stringify(updatedTasks));
            return updatedTasks;
        });
        closeTaskAddBox();
    };

    const congratulate = () => {
        const congratsElement = document.getElementById('congrats');
        congratsElement.classList.remove('hidden');
        congratsElement.classList.add('visible');

        setTimeout(function () {
            congratsElement.classList.remove('visible');
            congratsElement.classList.add('hidden');
        }, 2000);
    };

    const removeTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const completeTask = (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        setPoints(points + task.diff * 10);
        setTasks(tasks.filter(task => task.id !== taskId));
        congratulate();
    };

    const editTask = (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        setTitleInput(task.title);
        setDescInput(task.desc);
        setDatetimeInput(task.datetime);
        setDiffInput(task.diff);
        setPriorityInput(task.priority);
        setTaskAddBoxVisible(true);
        removeTask(taskId); // Remove the task from the list while editing
    };

    return (
        <div className='taskPage'>
            <div>
                <a id="loginPageLink" href="../LoginPage/LoginPage.html">Logout</a>
            </div>
            <h1>Task Garden Task View Page</h1>
            <div id="pointCount">{points} Points</div>
            <p>
                Here you can view the list of tasks you've added, the date and time they are to be completed (if applicable),
                the difficulty level, and how many points will be awarded for completing it.
            </p>
            <h3>Click the button below to add a new task!</h3>
            <div id="taskButtonDiv"><button id="addTaskButton" onClick={showTaskAddBox}>Add a Task!</button></div>
            {taskAddBoxVisible && (
                <div id="taskAddBox" className="popup">
                    <h2>Task Information</h2>
                    <form id="taskInfo">
                        <label htmlFor="title">Title:</label>
                        <input type="text" id="title" name="title" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} required /><br /><br />
                        <label htmlFor="desc">Description:</label>
                        <input type="text" id="desc" name="desc" value={descInput} onChange={(e) => setDescInput(e.target.value)} /><br /><br />
                        <label htmlFor="datetime">Date and Time:</label>
                        <input type="datetime-local" id="datetime" name="datetime" value={datetimeInput} onChange={(e) => setDatetimeInput(e.target.value)} /><br /><br />
                        <label htmlFor="diff">Difficulty:</label>
                        <input type="range" id="diff" name="diff" min="1" max="5" value={diffInput} onChange={(e) => setDiffInput(parseInt(e.target.value))} />
                        <output id="diffOutput">{diffInput}</output><br /><br />
                        <label htmlFor="priority">Priority:</label>
                        <input type="range" id="priority" name="priority" min="1" max="3" value={priorityInput} onChange={(e) => setPriorityInput(parseInt(e.target.value))} />
                        <output id="priorityOutput">{priorityInput}</output><br /><br />
                        <button type="button" onClick={addTask}>Confirm</button>
                        <button type="button" onClick={closeTaskAddBox}>Cancel</button>
                    </form>
                </div>
            )}
            <h3>Current Task List:</h3>
            {tasks.map((task) => (
                <div key={task.id} className="task-item">
                    <div className="card-body">
                    <h3 class="card-title">{task.title}</h3>
                    <p class="card-text">{task.desc}</p>
                    <p class="card-text">{task.datetime}</p>
                    <p class="card-text">Difficulty Level: {task.diff}</p>
                    <p class="card-text">Priority Level: {task.priority}</p>
                    <div className="btn-div">
                        <button className="btn remove-btn" onClick={() => removeTask(task.id)}>Remove</button>
                        <button className="btn complete-btn" onClick={() => completeTask(task.id)}>Complete</button>
                        <button className="btn edit-btn" onClick={() => editTask(task.id)}>Edit</button>
                    </div>
                    <p id="pointCount" class="card-text">{task.diff * 10} Points</p>
                    </div>
                </div>
            ))}
            <h1 id="congrats" className="hidden">Congratulations!</h1>
        </div>
    );
}

export default TaskPage;
