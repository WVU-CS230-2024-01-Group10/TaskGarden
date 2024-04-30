// Import React and sweetalert components
import React, { useState, useEffect } from 'react';
import './Homepage.css'; 
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Import firestore components
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

/**
 * Homepage component for Task Garden.
 * Allows user to use earned points to grow a plant of their choosing. 
 */
function HomePage() {
    const [username, setUsername] = useState('');
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(0);
    const [totalPlants, setTotalPlants] = useState(0);
    const [stage, setStage] = useState(1);
    const navigate = useNavigate();
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
        // Redirect to login if no userID found
        if (!userID) {
            navigate('/login');
        } else {
            getUserInfo();
            console.log("Logged in as: " + username);
        }

        console.log("useEffect running. points: " + points);
    }, []);

    /**
     * Retrieves user's point count from the database.
     */
    const getPoints = async () => {
        const usersQuery = await getDocs(collection(db, "users"));
        const users = usersQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const currentUser = users.find(user => user.id === userID);

        // set username and points
        setUsername(currentUser.username);
        if (currentUser.points === undefined || currentUser.points === 'NaN')
            setPoints(0);
        else setPoints(currentUser.points);

        // Set total plants
        if (currentUser.totalPlants === undefined || currentUser.totalPlants === 'NaN')
            setTotalPlants(0);
        else setTotalPlants(currentUser. totalPlants);

         // set plant type and stage from db
         if (currentUser.plantType !== undefined) setPlantType(currentUser.plantType); else setPlantType("succulent");
         if (currentUser.plantStage !== undefined) setStage(currentUser.plantStage); else setStage(1);
    }

    /**
     * Updates the user's point count within the database.
     * @param {number} newPoints - The new point count.
     */
    const updatePoints = async (newPoints) => {
        const user = doc(db, "users", userID);
        await updateDoc(user, {
            points: newPoints
        })
        setPoints(newPoints);
    }

    /**
     * Updates the user's total plants count within the database.
     * @param {number} newTotalPlants - The new total plants count.
     */
    const updateTotalPlants = async (newTotalPlants) => {
        const user = doc(db, "users", userID);
        await updateDoc(user, {
            totalPlants: newTotalPlants
        })
        setTotalPlants(newTotalPlants);
    }

    // Show and hide plant selection popup
    const showPlantSelect = () => {
        setPlantType(plantType);
        setPlantSelectVisible(true);
    };

    const closePlantSelect = () => {
        setPlantSelectVisible(false);
    };

    // Show and hide navigation box
    const showNavBox = () => {
        setNavBoxVisible(true);
    }

    const closeNavBox = () => {
        setNavBoxVisible(false);
    };

    // Select a plant type
    async function selectPlant() {
        var selected = document.getElementById("plantTypeSelect").value;
        setPlantSelectVisible(false);

        Swal.fire({
            icon: 'info',
            title: `Plant switched.`,
            text: `${plantType} has been switched to ${selected}.`,
            showConfirmButton: false,
            timer: 2500,
        });

        setPlantType(selected);

        const user = doc(db, "users", userID);
        await updateDoc(user, { "plantType": selected });
    }

    // Map for level upgrade points
    const nxtStagePoints = new Map([ [1, 250], [2, 500], [3, 750], [4, 1000], [5, 'max level'] ]);
    
    // Upgrade plant to the next stage
    async function upgradePlant() {
        const user = doc(db, "users", userID);
        
        let lvlPoints = nxtStagePoints.get(stage);

        // Do nothing if plant is at max stage
        if (stage === 5) {
            console.log("plant is at maximum stage");
            return;
        }
        if (points >= lvlPoints) {
            try {
                // Add to plant total if about to max out current plant
                if (stage === 4){
                    updateTotalPlants(totalPlants + 1);
                }
                // Upgrade the plant
                setStage(prevStage => prevStage + 1);
                setPoints(prevPoints => prevPoints - lvlPoints);
                await updateDoc(user, { "plantStage": stage + 1 });
                localStorage.setItem("points", points - lvlPoints);
                updatePoints(points - lvlPoints);

                Swal.fire({
                    icon: 'success',
                    title: `Congratulations!`,
                    text: `${plantType} has been upgraded to stage ${stage + 1}`,
                    showConfirmButton: false,
                    timer: 2500,
                });

            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("Not enough points to upgrade plant.");
        }
    }

    /**
     * Handles user logout by removing user ID from local storage and navigating to login page.
     */
    const handleLogout = () => {
        localStorage.removeItem("userID");
        closePlantSelect();
        Swal.fire({
            icon: 'info',
            title: `${username} has been logged out.`,
            showCancelButton: false
        }).then(result => {
                navigate('/login');
        })
    }

    // Reset stage for development purposes
    const resetStage = async () => {
        setStage(1);
        const user = doc(db, "users", userID);
        await updateDoc(user, { "plantStage": 1 });
    }

    return (
        <body className="background">
            <div className="plant-view">
                <img className="plant" src={plantImages[`${plantType}_s${stage}.png`]} alt={`${plantType} stage ${stage}`} />
            </div>
        <div id='container' className="plant-container container">
            <div id='greeting'><h3>{username}'s Room</h3></div>
            <div id='message'><h3>Welcome to Task Garden! Use the buttons above to edit your plant, or navigate to a different page.</h3></div>
            <div>
                <div id="plantButtonDiv"><button className="selectPlantButton" id="selectPlantButton" onClick={showPlantSelect}>Select Plant</button></div>
                {plantSelectVisible && (
                    <div id="plantSelectBox" className="popup">
                        <h2>Select Plant</h2>
                        <form id="plantInfo">
                            <label htmlFor="title">Plant Type</label>
                            <select name="plantTypeSelect" id="plantTypeSelect">{/* doesn't work */}
                                <option value="cactus" selected>Cactus</option>
                                <option value="flower">Flower</option>
                                <option value="pothos">Pothos</option>
                                <option value="succulent">Succulent</option>
                            </select>
                            <button type="button" onClick={selectPlant}>Confirm</button>
                            <button type="button" onClick={closePlantSelect}>Cancel</button>
                        </form>
                    </div>
                )}
                
                <button id='upgradePlantButton' onClick={upgradePlant}>Upgrade: <br></br> {nxtStagePoints.get(stage)} points</button>

                <div id="openNavBoxDiv"><button className="selectPlantButton" id="selectPlantButton" onClick={showNavBox}>Pages</button></div>
                {navBoxVisible && (
                <div id="homePageNavBox" className="popup">
                    <h3>Task Garden Navigation</h3>
                    <Link className="link" id="taskPageLink" to="/tasks">Tasks</Link>
                    <Link className="link" id="profilePageLink" to="/profile">Profile</Link>
                    <button onClick={handleLogout}>Logout</button>
                    <button type="button" onClick={closeNavBox}>Cancel</button>
                </div>
                )}
                <div id="pointsBox" className="pointsBox">
                    <h3>Your Points:</h3>
                    <h1 style={{marginTop: "15px"}}>{points}</h1>
                </div>
                <div id="resetStageDiv" className="resetStageDiv">
                    <h4>Reset Stage (for dev purposes)</h4>
                    <button onClick={resetStage}>Reset</button>  
                </div>
                
            </div>
        </div>
        </body>
    );
}

export default HomePage;
