// Import React and necessary components
import React, { useState, useEffect } from 'react';
import './profileStyles.css';
import { collection, doc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; // Import Link component
import Swal from 'sweetalert2';
import CryptoJS from 'crypto-js';

/**
 * Profile page component for Task Garden.
 * Manages user's profile information and actions.
 */
function ProfilePage() {
    // State variables for user data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [completedTotal, setCompletedTotal] = useState(0);
    const [allTimePoints, setAllTimePoints] = useState(0);
    const [totalPlants, setTotalPlants] = useState(0);
    
    // for information change operations
    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [emailBoxVisible, setEmailBoxVisible] = useState(false);
    const [passwordBoxVisible, setPasswordBoxVisible] = useState(false);

    const navigate = useNavigate();

    // Retrieve userID from local storage
    const userID = localStorage.getItem("userID");

    // Import all plant images dynamically
    const importAll = (r) => {
        let images = {};
        r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
        return images;
    };
    const plantImages = importAll(require.context('../../img/plants', false, /\.(png|jpe?g|svg)$/));

    // Fetch user info from the database, only if user is logged in
    useEffect(() => {
        if (!userID) {
            navigate('/login');
        } else {
            getUserInfo();
            console.log("Logged in as: " + username);
        }
    }, [])

    // Retrieves user information from the database.
    const getUserInfo = async () => {

        // Get users and docs from db
        const usersQuery = await getDocs(collection(db, "users"));

        // Map users and docs
        const users = usersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Find current user with locally stored user id
        const currentUser = users.find(user => user.id === userID);

        // Set user information
        setUsername(currentUser.username);
        setEmail(currentUser.email);
        setCompletedTotal(currentUser.completedTotal);
        setAllTimePoints(currentUser.allTimePoints);

        if (currentUser.totalPlants === undefined || currentUser.totalPlants === 'NaN')
            setTotalPlants(0);
        else setTotalPlants(currentUser.totalPlants);
    }

    /**
     * Handles user logout by removing user ID from local storage and navigating to login page.
     */
    const handleLogout = () => {
        localStorage.removeItem("userID");
        Swal.fire({
            icon: 'info',
            title: `${username} has been logged out.`,
            showCancelButton: false
        }).then(result => {
            navigate('/login');
        })
    }

     /**
     * Handles account deletion by deleting the user document from the database and navigating to login page.
     */
    const handleAcctDelete = async () => {
        Swal.fire({
            icon: 'warning',
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this',
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: 'No, cancel!',
        }).then(async () => { 
            try {
                // Reference to the user document
                const userDocRef = doc(db, 'users', userID);

                // Delete the user document
                await deleteDoc(userDocRef);

                // Remove the user ID from local storage
                localStorage.removeItem("userID");

                // Display a confirmation message
                Swal.fire({
                    icon: 'success',
                    title: 'Account Deleted Successfully',
                    text: 'Your account has been deleted.',
                    showCancelButton: false
                }).then(result => {
                    // Navigate to the login page
                    navigate('/login');
                });
            } catch (error) {
                // Display an error message if deletion fails
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to Delete Account',
                    text: 'An error occurred while deleting your account. Please try again later.',
                    showCancelButton: false
                });
            }
        });
    }

    // Function for handling an email change
    const changeEmail = async () => {

        // Get user from db
        const usersQuery = await getDocs(collection(db, "users"));
        const users = usersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const currentUser = users.find(user => user.id === userID);
        const userRef = doc(db, 'users', userID);

        if (currentEmail !== currentUser.email) { // test if emails match. if they don't, notify the user.
            Swal.fire({
                icon: 'error',
                title: 'Email mismatch!',
                text: "Please make sure you entered the correct email.",
                showConfirmButton: false,
                timer: 1500,
            })
        } else { // if they do, update the user's email in the database.
            await updateDoc(userRef, {
                email: newEmail
            })

            Swal.fire({ // then notify the user
                icon: 'success',
                title: 'Email changed!',
                text: `Your email has been successfully changed to ${newEmail}`,
                showConfirmButton: false,
                timer: 1500,
            })
        }

        // hide the email edit box
        hideEmailBox();
    }

    // Function for handling editing the user's password
    const changePassword = async () => {

        // Get user from db
        const usersQuery = await getDocs(collection(db, "users"));
        const users = usersQuery.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const currentUser = users.find(user => user.id === userID);
        const userRef = doc(db, 'users', userID);

        // test if the input password matches the logged in one
        if (CryptoJS.SHA256(currentPassword).toString(CryptoJS.enc.Hex) !== currentUser.password) {
            Swal.fire({ // if not, notify the user
                icon: 'error',
                title: 'Password mismatch!',
                text: "Please make sure you entered the correct password.",
                showConfirmButton: false,
                timer: 2000,
            })
        } else if (newPassword === newPassword2) { // if they do, update to the new password
            await updateDoc(userRef, {
                password: CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex)
            })

            Swal.fire({ // then notify the user 
                icon: 'success',
                title: 'Password changed!',
                text: `Your password has been successfully changed!`,
                showConfirmButton: false,
                timer: 1500,
            })
        } else { // if newPassword fields don't match, notify the user.
            Swal.fire({
                icon: 'error',
                title: 'Password mismatch!',
                text: `Please ensure the new password re-entry matches the initial one.`,
                showConfirmButton: false,
                timer: 2500,
            })
        }

        // hide the password input box.
        hidePasswordBox();
    }

    // function for showing the email input box.
    const showEmailBox = () => {
        setEmailBoxVisible(true);
    }

    // function for showing the password input box.
    const showPasswordBox = () => {
        setPasswordBoxVisible(true);
    }

    // function for hiding the email input box.
    const hideEmailBox = () => {
        setEmailBoxVisible(false);
    }

    // function for hiding the password input box.
    const hidePasswordBox = () => {
        setPasswordBoxVisible(false);
    }

    return (
        <div id='container' className="ProfilePage">
            {emailBoxVisible && (
                    <div id="emailBox" className="popup">
                        <h2>Change Email</h2>
                        <form id="emailInfo">
                            <label htmlFor="currentEmail">Current Email:</label>
                            <input type="text" id="currentEmail" name="currentEmail" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} required /><br /><br />
                            <label htmlFor="newEmail">New Email:</label>
                            <input type="text" id="newEmail" name="newEmail" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required /><br /><br />
                            <button type="button" onClick={changeEmail}>Confirm</button>
                            <button id="taskAddBoxCancelButton" type="button" onClick={hideEmailBox}>Cancel</button>
                        </form>
                    </div>
            )}
            {passwordBoxVisible && (
                    <div id="passwordBox" className="popup">
                        <h2>Change Password</h2>
                        <form id="passwordInfo">
                            <label htmlFor="currentPassword">Current Password:</label>
                            <input type="password" id="currentPassword" name="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required /><br /><br />
                            <label htmlFor="newPassword">New Password:</label>
                            <input type="password" id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required /><br /><br />
                            <label htmlFor="newPassword2">Confirm New Password:</label>
                            <input type="password" id="newPassword2" name="newPassword2" value={newPassword2} onChange={(e) => setNewPassword2(e.target.value)} required /><br /><br />
                            <button type="button" onClick={changePassword}>Confirm</button>
                            <button id="taskAddBoxCancelButton" type="button" onClick={hidePasswordBox}>Cancel</button>
                        </form>
                    </div>
            )}
            <h1 className="userLabel">My Profile</h1>
            <div className="gridContainer">
                <div className="item1">
                    <h2>Account Information</h2>
                    <p>Username: {username}</p>
                    <p>Email: {email}</p>
                    <button onClick={showEmailBox} type="button" className="change">Change email</button>
                    <button onClick={showPasswordBox} type="button" className="change">Change password</button>
                    <h2 className="achievementsLabel">Achievements</h2>
                    <p>Total Tasks Completed: {completedTotal}</p>
                    <p>Total Points Earned: {allTimePoints}</p>
                    <p>Total Plants Grown: {totalPlants}</p>
                </div>
                <div className="item2">
                    <h2>Current plant: Succulent</h2>
                    <img src={plantImages[`succulent_s1.png`]} alt="Succulent Stage 1" />
                </div>
                <div className="item3">
                    <button onClick={handleAcctDelete} type="button" className="deleteAccBtn">Delete Account</button>
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