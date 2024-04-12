import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom'; // Import useNavigate
import './loginStyles.css';

// FIREBASE: Import the functions you need from the SDKs you need
import { doSignInWithEmailAndPassword, doSignInWithGoogle } from '../../firebase/auth';
import { useAuth } from '../../contexts/authContext/index';

function LoginPage() {

  // broken code
  // const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform login logic here
    if (!isSigningIn) {
      setIsSigningIn(true);
      await doSignInWithEmailAndPassword(email, password);
    }

    // For demonstration purposes, navigate to the TaskPage
    navigate('/tasks'); // Navigate to TaskPage
  };

  const onGoogleSignIn = (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle().catch(err => {
        setIsSigningIn(false);
      })
    }
  }

  return (
    <div className="container">
      {/* Broken code: */}
      {/* {userLoggedIn && (<Navigate to={'/home'} replace={true} />)} */}
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>🪴 Welcome to TaskGarden 🪴</h2>
        <input type="email" name="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="Password" required />
        <button type="submit" disabled={isSigningIn}>{isSigningIn ? 'Signing In...' : 'Sign In'}</button>
        <button onClick={onGoogleSignIn}>Sign in with Google</button>
        <Link to="/register">New User? Register Here</Link>
      </form>
    </div>
  );
}

export default LoginPage;