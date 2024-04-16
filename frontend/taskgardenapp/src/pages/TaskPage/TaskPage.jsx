// version 4/15/24 - all commented code is broken auth stuff

import React, { useState, useEffect, /* useContext */ } from 'react';
// import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
// import UserContext from '../../contexts/UserContext';
import './taskStyles.css';
import { Link, useNavigate } from 'react-router-dom'; // Import Link component
// import { doSignOut } from '../../firebase/auth';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';

function TaskPage() {
    // const { user } = useContext(UserContext); part of broken auth code 
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
    const navigate = useNavigate();

    // google auth
    // const auth = getAuth();
    // auth.useDeviceLanguage();

    // get user ID from localStorage
    const userID = localStorage.getItem("userID");

    // fetch tasks from db, only if user is logged in
    useEffect(() => {
        if (!userID) {
            navigate('/login');
        } else {
            getUserInfo();
            console.log("Logged in as: " + username);
        }
    }, [])

    // allow the user to stay signed in on refresh
    //     setPersistence(auth, browserSessionPersistence)
    //     .then(() => {
    //         // Authentication state will persist across browser sessions
    // })
    //     .catch((error) => {
    //         console.log(error);
    // });

    /* function getUserInfo (version 4/16/24)
    * author: C. Jones
    * this function retrieves information about the user that is relevant to the task page. (username, tasks, points) */
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

        // set user information
        setUsername(currentUser.username);
        if (currentUser.points === undefined || currentUser.points === 'NaN')
            setPoints(0);
        else setPoints(currentUser.points);
        setTasks(tasks);

        // display information
        document.getElementById('tally').style.display = 'block';
        document.getElementById('fetchingUserInfoMessage').style.display = 'none';
      }

    const updatePoints = async (newPoints) => {
        const user = doc(db, "users", userID);
        await updateDoc(user, {
            points: newPoints
        })
        setPoints(newPoints);
    }

    const showTaskAddBox = () => {
        setTitleInput('');
        setDescInput('');
        setDatetimeInput('');
        setDiffInput(2); // Reset to default difficulty
        setPriorityInput(2); // Reset to default priority
        setTaskAddBoxVisible(true);
    };

    const showNavBox = () => {
        setNavBoxVisible(true);
    }

    const closeTaskAddBox = () => {
        setTaskAddBoxVisible(false);
    };

    const closeNavBox = () => {
        setNavBoxVisible(false);
    };

    const addTask = async () => {
        const newTask = {
            "title": titleInput,
            "desc": descInput,
            "datetime": datetimeInput,
            "diff": diffInput,
            "priority": priorityInput
        };
    
        if (newTask.title === "") { newTask.title = "Unnamed Task" };
        if (newTask.desc === "") { newTask.desc = "This task has no description" };
    
        try {
            await addDoc(collection(db, "users", userID, "tasks"), {...newTask});
            closeTaskAddBox();
    
            // Fetch the updated list of tasks from the database
            getUserInfo();
    
            if (!isEditing) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: `"${newTask.title}" has been added.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Edited!',
                    text: `"${newTask.title}" has been edited.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
            }
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
    
    

    const removeTask = async (taskId) => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this',
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: 'No, cancel!',
        }).then(result => {
            if (result.value) {
                const [task] = tasks.filter(task => task.id === taskId);
    
                // remove from firebase
                deleteDoc(doc(db, "users", userID, "tasks", taskId)).then(() => {
                    // Update the task list state after deleting the task
                    setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
    
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
    

    // function removeWithoutAsking for completion and editing
    const removeWithoutAsking = (taskId) => {
        const [task] = tasks.filter(task => task.id === taskId)
            // delete from firebase
            deleteDoc(doc(db, "users", userID, "tasks", taskId));
    }

    const completeTask = async (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        const newPoints = points + task.diff * 10;
    
        // Update the task list state after completing the task
        const updatedTasks = tasks.filter(t => t.id !== taskId);
        setTasks(updatedTasks);
    
        setPoints(newPoints);
        removeWithoutAsking(taskId);
        Swal.fire({
            icon: 'success',
            title: `Congratulations!`,
            text: `${task.title} has been completed. You have earned ${task.diff * 10} points!`,
            showConfirmButton: false,
            timer: 2500,
        }).then(result => {
            updatePoints(points + (task.diff * 10));
        });
    };
    

    const editTask = async (taskId) => {
        const task = tasks.find(task => task.id === taskId);
        setIsEditing(true);
        setTitleInput(task.title);
        setDescInput(task.desc);
        setDatetimeInput(task.datetime);
        setDiffInput(task.diff);
        setPriorityInput(task.priority);
        setTaskAddBoxVisible(true);
        removeWithoutAsking(taskId);
    };

    const handleLogout = () => {
        localStorage.removeItem("userID");
        Swal.fire({
            icon: 'info',
            title: `${username} has been logged out.`,
            showCancelButton: false
        }).then(result => {
            // doSignOut().then(() => {
                navigate('/login');
            // });
        })
    }

    return (
        <div className='taskPage'>
            <button id="logoutButton" onClick={handleLogout}>Logout</button>
            <h1>Task Garden Task View Page</h1>
            {userID && (<h3>Logged in as: {username}</h3>)}
            <div id="tally">You have {points} Points!</div>
            <p id='pageDesc'>
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
                        <button className="btn remove-btn" onClick={() => removeTask(task.id, true)}>Remove</button>
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
                <Link className="link" id="homePageLink" to="/home">Home</Link>
                <Link className="link" id="greenhousePageLink" to="/greenhouse">The Greenhouse</Link>
                <Link className="link" id="studyPageLink" to="/study">Study</Link>
                <Link className="link" id="profilePageLink" to="/profile">Profile</Link>
                <button onClick={handleLogout}>Logout</button>
                <button type="button" onClick={closeNavBox}>Cancel</button>
            </div>
            )}
        </div>
    );
}

export default TaskPage;
