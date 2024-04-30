/*
 *  LoginPage.jsx
 *  Authors: C. Jones, E. Hall
 *  Version 4.30.2024
 */ 

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './loginStyles.css';

function LoginPage() {

  // State variables to manage users, email, and password
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Fetches users from Firestore database on component mount
  useEffect(() => {
    getUsers();
  }, []);

  // Hook for navigation
  const navigate = useNavigate();

  // Fetches users from Firestore database
  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setUsers(users);
  }

  // Handles form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    document.getElementById('container').style.display = 'none';

    // Finds the current user by email
    const currentUser = users.find(user => user.email === email);
    if (currentUser === undefined ) {
      // Displays an error message if the account is not found
      Swal.fire({
        icon: 'error',
        title: 'Account not found!',
        text: `Please check your username and password again.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
      }).then(result => {
        document.getElementById('container').style.display = 'block';
      });
    } else if (currentUser.password !== password) {
      // Displays an error message if the password is incorrect
      Swal.fire({
        icon: 'error',
        title: 'Incorrect password!',
        text: `Please check your password again.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
      }).then(result => {
        document.getElementById('container').style.display = 'block';
      });
    } else {
      // Sets the user ID in local storage and displays a success message
      localStorage.setItem("userID", currentUser.id);
      Swal.fire({
        icon: 'success',
        title: 'Logged in!',
        text: `Hello, ${currentUser.username}!`,
        showConfirmButton: false,
        timer: 1500
      }).then(result => {
        // Navigates to the HomePage after successful login
        navigate('/');
      });
    }
  };

  return (
    <div id="container" className="container">
        <div id="loginBox">
          <form id="loginForm" onSubmit={handleSubmit}>
            <h2>🪴 Welcome to TaskGarden 🪴</h2>
            <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
            <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
            <button type="submit">Sign In</button>
            <Link to="/register">New User? Register Here</Link>
          </form>
        </div>
    </div>
  );
}

export default LoginPage;