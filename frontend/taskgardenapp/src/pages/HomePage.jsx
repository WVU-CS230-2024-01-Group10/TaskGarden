import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css'; 
import { Link } from 'react-router-dom'; // Import Link component
import axios from 'axios';
import { useAuth } from '../contexts/authContext';

function HomePage() {
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(0);
    const [stage, setStage] = useState(1);
    const { currentUser } = useAuth();

    useEffect(() => {
        const storedPlantType = localStorage.getItem("plantType");
        if (storedPlantType) setPlantType(JSON.parse(storedPlantType));

        const storedPoints = localStorage.getItem("points");
        if (storedPoints) setPoints(JSON.parse(storedPoints));

        const storedStage = localStorage.getItem("stage");
        if (storedStage) setStage(JSON.parse(storedStage));

        updateView();
        console.log(points);
    }, []);

    // fetch points from db
    useEffect(() => {
        const fetchPoints = async () => {
            try {
                const res = await axios.get("http://localhost:3500/points");
                console.log("Points: " + res.data.points)
                setPoints(res.data.points);
            } catch (err) {
                console.log(err);
            }
        };

        fetchPoints();
    }, []);

    function updateView() {
        // i'm not sure how this one converts to react
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
                const res = await axios.post('http://localhost:3500/points', {points: points - 100});
                updateView();
            } catch (err) {
                console.log(err);
            }
        } else {
            console.log("not enough points to upgrade plant");
        }
    }

    return (
        <div className="container">
            <h3>Hello, {currentUser.displayName ? currentUser.displayName : currentUser.email}!</h3>
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
