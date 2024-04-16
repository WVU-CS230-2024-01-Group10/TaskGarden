import React, { useState, useEffect } from 'react';
import './Homepage.css'; 
import { Link, useNavigate } from 'react-router-dom'; // Import Link component
import Swal from 'sweetalert2';
// import { useAuth } from '../../contexts/authContext';

// firestore imports
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function HomePage() {
    const [username, setUsername] = useState('');
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(400);
    const [stage, setStage] = useState(1);
    const navigate = useNavigate();
    // const { currentUser } = useAuth();
    const [plantSelectVisible, setPlantSelectVisible] = useState(false);


    // get user ID from localStorage
    const userID = localStorage.getItem("userID");


    // Import all plant images dynamically
    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    };
    const plantImages = importAll(require.context('../img/plants', false, /\.(png|jpe?g|svg)$/));
    
    useEffect(() => {
        const storedPlantType = localStorage.getItem("plantType");
        if (storedPlantType) setPlantType(JSON.parse(storedPlantType));

        const storedPoints = localStorage.getItem("points");
        if (storedPoints) setPoints(JSON.parse(storedPoints));

        const storedStage = localStorage.getItem("stage");
        if (storedStage) setStage(JSON.parse(storedStage));

        getPoints(); // fetch points from db
        console.log("useEffect running. points: " + points);
    }, []);

    /* function getPoints (version 4/16/24)
    * author: C. Jones
    * this function retrieves the user's point count from the db */
    const getPoints = async () => {
        const usersQuery = await getDocs(collection(db, "users"));
        const users = usersQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const currentUser = users.find(user => user.id === userID);

        // set username and points
        setUsername(currentUser.username);
        if (currentUser.points === undefined || currentUser.points === 'NaN')
        setPoints(0);
        else setPoints(currentUser.points);
    }

    /* function updatePoints (version 4/16/24)
    * author: C. Jones
    * this function updates the user's point count within the db */
    const updatePoints = async (newPoints) => {
        const user = doc(db, "users", userID);
        await updateDoc(user, {
            points: newPoints
        })
        setPoints(newPoints);
    }

    const showPlantSelect = () => {
        setPlantType(plantType);
        setPlantSelectVisible(true);
    };

    const closePlantSelect = () => {
        setPlantSelectVisible(false);
    };

    async function selectPlant() {
        setPlantType();
    }

    async function upgradePlant() {
        if (stage === 5) {
            console.log("plant is at maximum stage");
            return;
        }
        if (points >= 100) {
            try {
                setStage(prevStage => prevStage + 1);
                setPoints(prevPoints => prevPoints - 100);
                localStorage.setItem("stage", stage + 1);
                localStorage.setItem("points", points - 100);
                updatePoints(points - 100);
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("not enough points to upgrade plant");
        }
    }

    /* function handleLogout (version 4/16/24)
    * author: C. Jones
    * this function removes the user's ID from local storage and notifies them */
    const handleLogout = () => {
        localStorage.removeItem("userID");
        document.getElementById('container').style.display = 'none';
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
        <div class = "background">
        <div className="container">
            {/* <h3>Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h3> */}
            <div className="plant-view">
                Plant Here
                <img src={plantImages[`${plantType}_s${stage}`]} alt={`${plantType} stage ${stage}`} /> //remove .png to get css names of the plants
                <button onClick={upgradePlant}>Upgrade for 100 points</button>
                <p>(reset button for dev purposes)</p>
                <button onClick={() => {localStorage.setItem("stage", 1)}}>Reset Stage</button>
                <p>Your Points: {points}</p>
            </div>
            <div>
                <div id="plantButtonDiv"><button id="selectPlantButton" onClick={showPlantSelect}>Select Plant</button></div>
                {plantSelectVisible && (
                    <div id="plantSelectBox" className="popup">
                        <h2>Select Plant</h2>
                        <form id="plantInfo">
                            <label htmlFor="title">Plant Type</label>
                            <select name="plantTypeSelect" id="plantTypeSelect"  value={plantType}>
                                <option value="cactus">Cactus</option>
                                <option value="flower">Flower</option>
                                <option value="pothos">Pothos</option>
                                <option value="succulent">Succulent</option>
                            </select>
                            <button type="button" onClick={selectPlant}>Confirm</button>
                            <button type="button" onClick={closePlantSelect}>Cancel</button>
                        </form>
                    </div>
                )}
                </div>
            <div className="link-board">
                <Link className="link" id="taskPageLink" to="/tasks">Task List</Link>
                <Link className="link" id="greenhousePageLink" to="/greenhouse">The Greenhouse</Link>
                <Link className="link" id="studyPageLink" to="/study">Study</Link>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    </div>
    );
}

export default HomePage;
