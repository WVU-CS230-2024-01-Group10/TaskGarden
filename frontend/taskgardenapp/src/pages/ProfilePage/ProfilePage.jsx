import React, { useState, useEffect } from 'react';
import './profileStyles.css'; 
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import {  useNavigate } from 'react-router-dom'; // Import Link component
import Swal from 'sweetalert2';

// Need to implement db operations to fetch user info


function ProfilePage() {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');

    const userID = localStorage.getItem("userID");
    const navigate = useNavigate();

    // Import all plant images dynamically
    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    };
    const plantImages = importAll(require.context('../../img/plants', false, /\.(png|jpe?g|svg)$/));

    // fetch user info from db, only if user is logged in
    useEffect(() => {
        if (!userID) {
            navigate('/login');
        } else {
            getUserInfo();
            console.log("Logged in as: " + username);
        }
    }, [])

    /* function getUserInfo (version 4/16/24)
    * author: C. Jones
    * this function retrieves information about the user that is relevant to the task page. (username, tasks, points) */
    const getUserInfo = async () => {

        // get users and docs from db
        const usersQuery = await getDocs(collection(db, "users"));

        // map users and docs
        const users = usersQuery.docs.map(doc => ({id: doc.id, ...doc.data()}));

        // find current user with locally stored user id
        const currentUser = users.find(user => user.id === userID);

        // set user information
        setUsername(currentUser.username);
        setEmail(currentUser.email);
    }

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
        <div className="ProfilePage">
            <h1 className="userLabel">My Profile</h1>
            <div id='container' className="gridContainer">
                <div className="item1">
                    <h2>Account Information</h2>
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <button type="button" className="change">Change email</button>
                    <button type="button" className="change">Change password</button>
                    <h2 className="achievementsLabel">Achievements</h2>
                    <p>Total Tasks Completed: ...</p>
                    <p>Total Points Earned: ...</p>
                    <p>Total Plants Grown: 1</p>
                </div>
                <div className="item2">
                    <h2>Current plant: Succulent</h2>
                    <img src={plantImages[`succulent_s1.png`]} alt="Succulent Stage 1" />
                </div>
                <div className="item3">
                    <button type="button" className="deleteAccBtn">Delete Account</button>
                    <p className="alert">*Account cannot be recovered after deletion.</p>
                </div>
                <div className="item4">
                    <a href="/">
                        <button onClick={handleLogout} type="button" className="signOutBtn"> Sign Out</button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;