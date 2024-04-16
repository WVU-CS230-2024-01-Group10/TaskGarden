import React, { useState, useEffect } from 'react';
import './Homepage.css'; 
import { Link } from 'react-router-dom'; // Import Link component
// import { useAuth } from '../../contexts/authContext';

// firestore imports
import { db } from '../../firebase/firebase';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

function HomePage() {
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(0);
    const [stage, setStage] = useState(1);
    // const { currentUser } = useAuth();

    // get user ID from localStorage
    const userID = localStorage.getItem("userID");

    useEffect(() => {
        const storedPlantType = localStorage.getItem("plantType");
        if (storedPlantType) setPlantType(JSON.parse(storedPlantType));

        const storedPoints = localStorage.getItem("points");
        if (storedPoints) setPoints(JSON.parse(storedPoints));

        const storedStage = localStorage.getItem("stage");
        if (storedStage) setStage(JSON.parse(storedStage));

        getPoints(); // fetch points from db
        console.log(points);
    }, [points]);

    /* function getPoints (version 4/16/24)
    * author: C. Jones
    * this function retrieves the user's point count from the db */
    const getPoints = async () => {
        const usersQuery = await getDocs(collection(db, "users"));
        const users = usersQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const currentUser = users.find(user => user.id === userID);
        setPoints(currentUser.points);
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

    return (
        <div className="container">
            {/* <h3>Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h3> */}
            <div className="plant-view">
                Plant Here
                <img src={`${plantType}_${stage}.png`} alt={`${plantType} stage ${stage}`} />
                <button onClick={upgradePlant}>Upgrade for 100 points</button>
                <p>(reset button for dev purposes)</p>
                <button onClick={() => {localStorage.setItem("stage", 1)}}>Reset Stage</button>
                <p>Your Points: {points}</p>
            </div>
            <div className="link-board">
                <Link className="link" id="taskPageLink" to="/tasks">Task List</Link>
                <Link className="link" id="greenhousePageLink" to="/greenhouse">The Greenhouse</Link>
                <Link className="link" id="studyPageLink" to="/study">Study</Link>
                <Link className="link" id="loginPageLink" to="/login">Logout</Link>
            </div>
        </div>
    );
}

export default HomePage;
