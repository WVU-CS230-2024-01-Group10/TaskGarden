import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css'; 
import { Link } from 'react-router-dom'; // Import Link component

function HomePage() {
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(0);
    const [stage, setStage] = useState(1);

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

    function updateView() {
        // i'm not sure how this one converts to react
    }

    function upgradePlant() {
        if (stage === 5) {
            console.log("plant is at maximum stage");
            return;
        }
        if (points >= 100) {
            setStage(prevStage => prevStage + 1);
            setPoints(prevPoints => prevPoints - 100);
            localStorage.setItem("stage", stage + 1);
            localStorage.setItem("points", points - 100);
            updateView();
        } else {
            console.log("not enough points to upgrade plant");
        }
    }

    return (
        // original html code
        // <div className="container">
        //     <div className="plant-view">
        //         Plant Here
        //         <img src={`${plantType}_${stage}.png`} alt={`${plantType} stage ${stage}`} />
        //         <button onClick={upgradePlant}>Upgrade</button>
        //     </div>
        //     <div className="link-board">
        //         <Link className="link" id="taskPageLink" to="/tasks">Task List</Link>
        //         <Link className="link" id="greenhousePageLink" to="/greenhouse">The Greenhouse</Link>
        //         <Link className="link" id="studyPageLink" to="/study">Study</Link>
        //         <Link className="link" id="loginPageLink" to="/login">Logout</Link>
        //     </div>
        // </div>

        // code for the purposes of the presentation.
        <div className="container">
            <p>Eventually there will be content here.</p>
        </div>
    );
}

export default HomePage;
