/*
 *  TaskPage.jsx
 *  Authors: C. Jones, E. Hall, D. Campa, S. Tabidze, G. Breeden
 *  Version 4.30.2024
 */ 

import React, { useState, useEffect } from 'react';
import './taskStyles.css';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';

function TaskPage() {

    // State variables to manage tasks, points, username, inputs, popup boxes, edit flags, and stats for completed tasks and all-time points.
    const [tasks, setTasks] = useState([]);
    const [points, setPoints] = useState(0);
    const [username, setUsername] = useState('');
    const [titleInput, setTitleInput] = useState('');
    const [descInput, setDescInput] = useState('');
    const [datetimeInput, setDatetimeInput] = useState('');
    const [diffInput, setDiffInput] = useState(2); // Default difficulty
    const [priorityInput, setPriorityInput] = useState(2); // Default priority
    const [taskAddBoxVisible, setTaskAddBoxVisible] = useState(false);
    const [navBoxVisible, setNavBoxVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [completedTotal, setCompletedTotal] = useState(0);
    const [allTimePoints, setAllTimePoints] = useState(0);

    // Hook for navigation
    const navigate = useNavigate();

    // Get the User's ID from Local Storage.
    const userID = localStorage.getItem("userID");

    // Fetch tasks from the Firestore database ONLY if the user is logged in
    useEffect(() => {
        if (!userID) { // if the user is NOT logged in, navigate them to the login page.
            navigate('/login');
        } else { // if the user IS logged in, get their info from the database.
            getUserInfo();
            console.log("Logged in as: " + username);
        }
    }, [])

    /* function getUserInfo retrieves information about the user that is relevant to the task page. (username, tasks, points) */
    const getUserInfo = async () => {

        // show "fetching user info..." message and hide inaccurate tally
        document.getElementById('tally').style.display = 'none';
        document.getElementById('fetchingUserInfoMessage').style.display = 'block';

        // get users and docs from db
        const usersQuery = await getDocs(collection(db, "users"));
        const tasksQuery = await getDocs(collection(db, "users", userID, "tasks"));

        // map users and docs
        const users = usersQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const tasks = tasksQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));

        // find current user with locally stored user id
        const currentUser = users.find(user => user.id === userID);

        // set username
        setUsername(currentUser.username);

        // set user points
        if (currentUser.points === undefined || currentUser.points === 'NaN')
            setPoints(0);
        else setPoints(currentUser.points);

        // set user all time points earned
        if (currentUser.allTimePoints === undefined || currentUser.allTimePoints === 'NaN')
            setAllTimePoints(0);
        else setAllTimePoints(currentUser.allTimePoints);

        // set user total completed tasks
        if (currentUser.completedTotal === undefined || currentUser.completedTotal === 'NaN')
            setCompletedTotal(0);
        else setCompletedTotal(currentUser.completedTotal);

        // set user task list
        setTasks(tasks);

        // display information
        document.getElementById('tally').style.display = 'block';
        document.getElementById('fetchingUserInfoMessage').style.display = 'none';
      }

    /* function updatePoints updates the user's points within the database using the newPoints parameter. */
    const updatePoints = async (newPoints) => {
        // find the logged-in user within the database.
        const user = doc(db, "users", userID);

        // update the user's points in Firestore according to the newPoints parameter.
        await updateDoc(user, {
            points: newPoints
        })

        // update the points within the app. 
        setPoints(newPoints);
    }

    /* function updateAllTimePoints updates the user's all-time points within the database using the newAllTime parameter. */
    const updateAllTimePoints = async (newAllTime) => {
        // find the logged-in user within the database.
        const user = doc(db, "users", userID);

        // update the user's all-time points in Firestore according to the newAllTime parameter.
        await updateDoc(user, {
            allTimePoints: newAllTime
        })

        // update the all-time points within the app. 
        setAllTimePoints(newAllTime);
    }

    /* function updateCompletedTotal updates the user's all-time completed tasks within the database */
    const updateCompletedTotal = async (newTotal) => {
        const user = doc(db, "users", userID);
        await updateDoc(user, {
            completedTotal: newTotal
        })
        setCompletedTotal(newTotal);
    }

    /* function showTaskAddBox displays the task add box to the user and ensures it is empty. */
    const showTaskAddBox = () => {
        // set inputs to empty indicating a NEW task is being created.
        setTitleInput('');
        setDescInput('');
        setDatetimeInput('');

        // initialize default difficulty and priority to '2'
        setDiffInput(2);
        setPriorityInput(2); 

        // show the task add box.
        setTaskAddBoxVisible(true);
    };

    /* function showNavBox displays the navigation box to the user. */
    const showNavBox = () => {
        setNavBoxVisible(true);
    }

    /* function closeTaskAddBox hides the task add box from the user. */
    const closeTaskAddBox = () => {
        setTaskAddBoxVisible(false);
    };

    /* function closeNavBox hides the navigation box from the user. */
    const closeNavBox = () => {
        setNavBoxVisible(false);
    };

    /* function addTask adds a new task to the UI and Firestore. */
    const addTask = async () => {

        // create a new task object from input fields
        const newTask = {
            "title": titleInput,
            "desc": descInput,
            "datetime": datetimeInput,
            "diff": diffInput,
            "priority": priorityInput
        };
    
        // if the title and description are left empty, set to hard-coded "empty" messages. 
        if (newTask.title === "") { newTask.title = "Untitled Task" };
        if (newTask.desc === "") { newTask.desc = "This task has no description" };
    
        try {

            // add the new task to the database and close the task add box.
            await addDoc(collection(db, "users", userID, "tasks"), {...newTask});
            closeTaskAddBox();
    
            // Fetch the updated list of tasks from the database
            getUserInfo();
    
            // if this function is not being called inside editTask, indicate that a new task is being added.
            if (!isEditing) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: `"${newTask.title}" has been added.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else { // if this function IS being called inside editTask, indicate that an existing task is being edited.
                Swal.fire({
                    icon: 'success',
                    title: 'Edited!',
                    text: `"${newTask.title}" has been edited.`,
                    showConfirmButton: false,
                    timer: 1500,
                }).then(() => {
                    setIsEditing(false); // indicate that the user is no longer editing.
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    /* function removeTask removes an existing task (indicated by the parameter taskId) from the UI and Firestore. */
    const removeTask = async (taskId) => {
        // verify that the user is sure they want to remove this task.
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this',
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: 'No, cancel!',
        }).then(result => { 
            if (result.value) { // if they confirm they are sure, remove the task

                // find the task that matches the taskId parameter
                const [task] = tasks.filter(task => task.id === taskId);
    
                // remove from firebase
                deleteDoc(doc(db, "users", userID, "tasks", taskId)).then(() => {
                    // Update the task list state after deleting the task
                    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    
                    // indicate to the user that the task has been successfully deleted.
                    Swal.fire({
                        icon: 'success',
                        title: 'Deleted!',
                        text: `${task.title} has been deleted.`,
                        showConfirmButton: false,
                        timer: 1500,
                    });
                });
            }
        });
    };
    
    // function removeWithoutAsking removes the task without asking for calls inside editTask and completeTask
    const removeWithoutAsking = (taskId) => {
        const [task] = tasks.filter(task => task.id === taskId)
            // delete from firebase
            deleteDoc(doc(db, "users", userID, "tasks", taskId));
    }

    // function completeTask removes the task from the UI and Firestore and awards the appropriate points to the user.
    const completeTask = async (taskId) => {

        // determine the current task from the taskId parameter
        const task = tasks.find(task => task.id === taskId);

        // determine the point count for the task.
        const newPoints = points + task.diff * 10;
    
        // Update the task list state after completing the task
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);

        // update the user's point count and remove the task.
        setPoints(newPoints);
        removeWithoutAsking(taskId);

        // indivate to the user that their points have been awarded.
        Swal.fire({
            icon: 'success',
            title: `Congratulations!`,
            text: `${task.title} has been completed. You have earned ${task.diff * 10} points!`,
            showConfirmButton: false,
            timer: 2500,
        }).then(result => {
            // update points and completed tasks within the database. 
            updatePoints(points + (task.diff * 10));
            updateAllTimePoints(allTimePoints + (task.diff * 10));
            updateCompletedTotal(completedTotal + 1);
        });
    };
    
    // function editTask allows the user to change the fields of an existing task (indicated by taskId parameter).
    const editTask = (taskId) => {
        // find the task that corresponds to the taskId parameter. 
        const task = tasks.find(task => task.id === taskId);

        // indicate that the user is editing so that the appropriate message can be displayed.
        setIsEditing(true);

        // set inputs to existing fields. 
        setTitleInput(task.title);
        setDescInput(task.desc);
        setDatetimeInput(task.datetime);
        setDiffInput(task.diff);
        setPriorityInput(task.priority);

        // display the task add box so that the user can edit fields.
        setTaskAddBoxVisible(true);

        // remove the old task without asking. 
        removeWithoutAsking(taskId);
    };

    // function handleLogout logs out the user from the app and redirects them to the login page.
    const handleLogout = () => {
        // hide all other elements on the page so that the user can see the message indicating their logout. 
        document.getElementById('container').style.display = 'none';

        // remove the user's ID from localStorage. 
        localStorage.removeItem("userID");

        // indicate to the user that their account has been logged out. 
        Swal.fire({
            icon: 'info',
            title: `${username} has been logged out.`,
            showCancelButton: false
        }).then(result => {
            // navigate to the login page.
            navigate('/login');
        })
    }

    return (
        <div id='container' className='taskPage'>
            <div style={{ margin: '15px' }} >
                <h1>🪴Task Garden🪴</h1>
            </div>
            {userID && (<h3>Logged in as: {username}</h3>)}
            <div id="tally" className>You have <br></br>{points} Points!</div>
            <h2>
                Task Management Made Easy!
            </h2>
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
                        <button id="taskAddBoxCancelButton" type="button" onClick={closeTaskAddBox}>Cancel</button>
                    </form>
                </div>
            )}
            <h3>Current Task List:</h3>
            <h1 id='fetchingUserInfoMessage' style={{display: 'none'}}>Fetching user info...</h1>
            {tasks.map((task) => (
                <div key={task.id} className="task-item">
                    <div className="card-body">
                    <h3 className="card-title">{task.title}</h3>
                    <p className="card-text">{task.desc}</p>
                    <p className="card-text">{task.datetime}</p>
                    <p className="card-text">Difficulty Level: {task.diff}</p>
                    <p className="card-text">Priority Level: {task.priority}</p>
                    <div className="btn-div">
                        <button className="btn remove-btn" onClick={() => removeTask(task.id)}>Remove</button>
                        <button className="btn complete-btn" onClick={() => completeTask(task.id)}>Complete</button>
                        <button className="btn edit-btn" onClick={() => editTask(task.id)}>Edit</button>
                    </div>
                    <p id="pointCount" className="card-text">{task.diff * 10} Points</p>
                    </div>
                </div>
            ))}
            <h1 id="congrats" className="hidden">Congratulations!</h1>
            <h3>Click here to navigate to a different page!</h3>
            <div id="openNavBoxDiv"><button id="openNavBox" onClick={showNavBox}>Pages</button></div>
            {navBoxVisible && (
                <div id="navBox" className="popup">
                    <h3>Task Garden Navigation</h3>
                    <Link className="link" id="homePageLink" to="/">Home</Link>
                    <Link className="link" id="profilePageLink" to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                    <button type="button" onClick={closeNavBox}>Cancel</button>
                </div>
            )}
        </div>
    );
}

export default TaskPage;
