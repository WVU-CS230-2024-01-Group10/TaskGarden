// Import React and necessary components
import React, { useState, useEffect } from 'react';
import './profileStyles.css';
import { collection, doc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useNavigate } from 'react-router-dom'; // Import Link component
import Swal from 'sweetalert2';

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

    /**
     * Retrieves user information from the database.
     */
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
    }

    // Function for handling editing user information (not implemented yet)
    const handleEditUserInfo = async () => {

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