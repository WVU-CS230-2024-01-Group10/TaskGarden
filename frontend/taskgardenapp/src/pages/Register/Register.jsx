import React, { useState, useEffect } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { addDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import Swal from 'sweetalert2';

const Register = () =>
{
    const navigate = useNavigate(); 
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    });

    const getUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        setUsers(users);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentUser = users.find(user => user.email === email);
        if (currentUser === undefined) {
            const newUser = {
                "username": username,
                "password": password,
                "email": email
            }

            try {
                await addDoc(collection(db, "users"), {...newUser});
                document.getElementById('container').style.display = 'none'
                localStorage.setItem("user", newUser);

                Swal.fire({
                    icon: 'success',
                    title: 'Logged in!',
                    text: `Hello, ${newUser.username}!`,
                    showConfirmButton: false,
                    timer: 1500
                }).then(result => {
                    document.getElementById('container').style.display = 'block'
                    navigate('/tasks');
                });
            } catch (err) {
                console.log(err);
            }
        } else {
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