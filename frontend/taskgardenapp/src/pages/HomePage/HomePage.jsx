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
    const [points, setPoints] = useState(0);
    const [stage, setStage] = useState(1);
    const navigate = useNavigate();
    // const { currentUser } = useAuth();
    const [plantSelectVisible, setPlantSelectVisible] = useState(false);
    const [navBoxVisible, setNavBoxVisible] = useState(false);


    // get user ID from localStorage
    const userID = localStorage.getItem("userID");

    // Import all plant images dynamically
    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    };
    const plantImages = importAll(require.context('../../img/plants', false, /\.(png|jpe?g|svg)$/));
    
    useEffect(() => {

        if (!userID) {
            navigate('/login');
        } else {
            getPoints();
            console.log("Logged in as: " + username);
        }

        const storedPlantType = localStorage.getItem("plantType");
        if (storedPlantType) setPlantType(JSON.parse(storedPlantType));

        const storedPoints = localStorage.getItem("points");
        if (storedPoints) setPoints(JSON.parse(storedPoints));

        const storedStage = localStorage.getItem("stage");
        if (storedStage) setStage(JSON.parse(storedStage));

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

    const showNavBox = () => {
        setNavBoxVisible(true);
    }

    const closeNavBox = () => {
        setNavBoxVisible(false);
    };

    async function selectPlant() {
        // setPlantType(document.getElementById("plantTypeSelect").value.body);
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
        <body className="background">
            <div className="plant-view">
                <img className="plant" src={plantImages[`${plantType}_s${stage}.png`]} alt={`${plantType} stage ${stage}`} />
            </div>
        <div className="plant-container container">
            {/* <h3>Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h3> */}
            {/* <div className="plant-view">
                <button onClick={upgradePlant}>Upgrade for 100 points</button>
                <p>(reset button for dev purposes)</p>
                <button onClick={() => {localStorage.setItem("stage", 1)}}>Reset Stage</button>
                <button onClick={() => {localStorage.setItem("points", 10000)}}>Get points</button>
                <p>Your Points: {points}</p>
            </div> */}
            <div>
                <div id="plantButtonDiv"><button className="selectPlantButton" id="selectPlantButton" onClick={showPlantSelect}>Select Plant</button></div>
                {plantSelectVisible && (
                    <div id="plantSelectBox" className="popup">
                        <h2>Select Plant</h2>
                        <form id="plantInfo">
                            <label htmlFor="title">Plant Type</label>
                            <select name="plantTypeSelect" id="plantTypeSelect">{/* doesn't work */}
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

                <button onClick={upgradePlant}>Upgrade (100 points)</button>
                {/* <button onClick={() => {localStorage.setItem("stage", 1)}}>Reset Stage</button>
                <button onClick={() => {updatePoints(1000)}}>Get points</button>
                <button onClick={() => {console.log(points)}}>See points</button> */}

                <div id="openNavBoxDiv"><button className="selectPlantButton" id="selectPlantButton" onClick={showNavBox}>Pages</button></div>
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
            {/* <div className="link-board">
                <Link className="link" id="taskPageLink" to="/tasks">Task List</Link>
                <Link className="link" id="greenhousePageLink" to="/greenhouse">The Greenhouse</Link>
                <Link className="link" id="studyPageLink" to="/study">Study</Link>
                <Link className="link" id="loginPageLink" to="/login">Logout</Link>
            </div> */}
        </div>
        </body>
    );
}

export default HomePage;
