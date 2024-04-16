// version 4/15/24 - all commented code is broken auth stuff

import React, { useContext, useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './loginStyles.css';
// import UserContext from '../../contexts/UserContext';

function LoginPage() {

  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);

  // const { setUser } = useContext(UserContext);

  const navigate = useNavigate(); 

  const getUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    setUsers(users);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    getUsers();
    document.getElementById('container').style.display = 'none';
  
    const currentUser = users.find(user => user.email === email);
    if (currentUser === undefined) {
      Swal.fire({
        icon: 'error',
        title: 'Account not found!',
        text: `Please check your username and password again.`,
        confirmButtonText: "OK",
        showConfirmButton: true,
      }).then(result => {
        document.getElementById('container').style.display = 'block';
      });
    } else {
      // setUser(currentUser);
      localStorage.setItem("userID", currentUser.id);
      Swal.fire({
        icon: 'success',
        title: 'Logged in!',
        text: `Hello, ${currentUser.username}!`,
        showConfirmButton: false,
        timer: 1500
      }).then(result => {
        // Navigate to the TaskPage
        navigate('/tasks');
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
            <button type="submit" disabled={isSigningIn}>{isSigningIn ? 'Signing In...' : 'Sign In'}</button>
            <Link to="/register">New User? Register Here</Link>
          </form>
        </div>
    </div>
  );
}

export default LoginPage;