import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/authContext';
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';

const Register = () =>
{
    const navigate = useNavigate(); // Initialize useNavigate
    // const { userLoggedIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRegistering) {
            setIsRegistering(true);
            await doCreateUserWithEmailAndPassword(email, password);
          }
    };

    return (
        <div className="container">
            {/* {userLoggedIn && (<Navigate to={'/home'} replace={true} />)} */}
            <form id="signUpForm" onSubmit={handleSubmit}>
                <h2>🪴 Create an Account! 🪴</h2>
                <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
                <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
}

export default Register;