/*
 *  Register.jsx
 *  Authors: C. Jones
 *  Version 4.30.2024
 */ 

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';
import './register.css';

const Register = () =>
{
    const navigate = useNavigate(); 

    // State variables to manage username, email, password, and users
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);

    // Fetches users from Firestore database on component mount
    useEffect(() => {
        getUsers();
    });

    // Fetches users from Firestore database
    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setUsers(users);
    }

    // Handles form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

    // Finds the current user by email
        const currentUser = users.find(user => user.email === email);
        if (currentUser === undefined) {
            // Creates a new user object if the user does not exist
            const newUser = {
                "username": username,
                "password": password,
                "email": email
            }

            try {
                // Adds the new user to Firestore database
                await addDoc(collection(db, "users"), {...newUser});
                document.getElementById('container').style.display = 'none'
                localStorage.setItem("user", newUser);

                // Displays a success message and navigates to the tasks page
                Swal.fire({
                    icon: 'success',
                    title: 'Account Created!',
                    text: `Welcome, ${newUser.username}!`,
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    document.getElementById('container').style.display = 'block'
                    navigate('/');
                });
            } catch (err) {
                console.log(err);
            }
        } else {
            // Displays an info message if the account already exists
            document.getElementById('container').style.display = 'none'
            Swal.fire({
                icon: 'info',
                title: 'Account found.',
                text: `An account with email ${email} already exists.`,
                confirmButtonText: "OK",
                showConfirmButton: true,
            }).then(result => {
                document.getElementById('container').style.display = 'block';
            });
        };
    };

    return (
        <div id='container' className="container">
            <form id="signUpForm" onSubmit={handleSubmit}>
                <h2>🪴 Create an Account! 🪴</h2>
                <input type="username" name="username" value={username} onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" required />
                <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default Register;