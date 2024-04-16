import React, { useState, useEffect } from 'react';
import './Homepage.css'; 
import { Link } from 'react-router-dom'; // Import Link component
import axios from 'axios';
import { useAuth } from '../../contexts/authContext';

function HomePage() {
    const [plantType, setPlantType] = useState("succulent");
    const [points, setPoints] = useState(0);
    const [stage, setStage] = useState(1);
    // const { currentUser } = useAuth();
    const [plantSelectVisible, setPlantSelectVisible] = useState(false);

    // Import all plant images dynamically
    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    };
    const plantImages = importAll(require.context('../../img/plants', false, /\.(png|jpe?g|svg)$/));
    
    useEffect(() => {
        const storedPlantType = localStorage.getItem("plantType");
        if (storedPlantType) setPlantType(JSON.parse(storedPlantType));

        const storedPoints = localStorage.getItem("points");
        if (storedPoints) setPoints(JSON.parse(storedPoints));

        const storedStage = localStorage.getItem("stage");
        if (storedStage) setStage(JSON.parse(storedStage));

        updateView();
        console.log(points);
    }, [points]);

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

    const showPlantSelect = () => {
        setPlantType(plantType);
        setPlantSelectVisible(true);
    };

    const closePlantSelect = () => {
        setPlantSelectVisible(false);
    };

    function updateView() {
        // i'm not sure how this one converts to react
    }

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
        <body className="background">
            <div className="plant-view">
                <img className="plant" src={plantImages[`${plantType}_s${stage}.png`]} alt={`${plantType} stage ${stage}`} />
            </div>
        <div className="container">
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
