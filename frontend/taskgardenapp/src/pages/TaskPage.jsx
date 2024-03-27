import React, { useState, useEffect } from 'react';
import '../styles/taskStyles.css';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

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
        const fetchAllTasks = async () => {
            try {
                const res = await axios.get("http://localhost:3500/tasks");
                console.log(res.data);
                setTasks(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchAllTasks();
    }, [])

    // // localStorage fetching: may become obsolete
    // useEffect(() => {
    //     const storedTasks = localStorage.getItem("tasks");
    //     if (storedTasks) {
    //         setTasks(JSON.parse(storedTasks));
    //     }
    // }, []);

    // useEffect(() => {
    //     const saveTask = () => {
    //         localStorage.setItem("tasks", JSON.stringify(tasks));
    //     };
    
    //     saveTask(); // Call saveTask inside useEffect
    
    //     return () => {
    //         // Cleanup function (optional) if needed
    //     };
    // }, [tasks]);

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

    const addTask = async () => {
        const newTask = {
            "id": uuidv4(), // Assign random number as id
            "title": titleInput,
            "desc": descInput,
            "datetime": datetimeInput,
            "diff": diffInput,
            "priority": priorityInput
        };
        console.log(newTask);

    
        if (newTask.title === "") { newTask.title = "Unnamed Task" };
        if (newTask.desc === "") { newTask.desc = "This task has no description" };
    
        // try/catch block for axios POST req. untested
        try {
            const response = await axios.post('http://localhost:3500/tasks', newTask);
            setTasks(prevTasks => [...prevTasks, newTask]);
            closeTaskAddBox();
        } catch (err) {
            console.log(err);
        }

        // reload the window to show the new task
        window.location.reload();
    };    

    const congratulate = () => {
        const congratsElement = document.getElementById('congrats');
        congratsElement.classList.remove('hidden');
        congratsElement.classList.add('visible');

        setTimeout(function () {
            congratsElement.classList.remove('visible');
            congratsElement.classList.add('hidden');
            window.location.reload();
        }, 1000);
    };

    const removeTask = async (taskId, reload) => {
        // setTasks(tasks.filter(task => task.id !== taskId));
        try {
            await axios.delete("http://localhost:3500/tasks/"+taskId);
        } catch (err) {
            console.log(err);
        }

        if (reload)
            window.location.reload();
    };

    const completeTask = (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        setPoints(points + task.diff * 10);
        removeTask(taskId, false);
        congratulate();
    };

    const editTask = async (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        setTitleInput(task.title);
        setDescInput(task.desc);
        setDatetimeInput(task.datetime);
        setDiffInput(task.diff);
        setPriorityInput(task.priority);
        setTaskAddBoxVisible(true);
        removeTask(taskId, false);
    };

    return (
        <div className='taskPage'>
            <div style={{ textAlign: 'right' }}>
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
                    <h3>{task.title}</h3>
                    <p>{task.desc}</p>
                    <p>{task.datetime}</p>
                    <p>Difficulty Level: {task.diff}</p>
                    <p>Priority Level: {task.priority}</p>
                    <div className="btn-div">
                        <button className="btn remove-btn" onClick={() => removeTask(task.id, true)}>Remove</button>
                        <button className="btn complete-btn" onClick={() => completeTask(task.id)}>Complete</button>
                        <button className="btn edit-btn" onClick={() => editTask(task.id)}>Edit</button>
                    </div>
                </div>
            ))}
            <h1 id="congrats" className="hidden">Congratulations!</h1>
        </div>
    );
}

export default TaskPage;
