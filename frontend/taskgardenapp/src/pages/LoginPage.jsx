import {React, useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/loginStyles.css';

// FIREBASE: Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signOut } from "firebase/auth";

function LoginPage() {

  useEffect(() => {
    // signOut code
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log("Signed out.");
    }).catch((error) => {
      // An error happened.
      console.log("Signout error: " + error);
    });
  })

  const navigate = useNavigate(); // Initialize useNavigate

            //Create an instance of the Google provider object:
  const provider = new GoogleAuthProvider();

  // Optional: Specify additional OAuth 2.0 scopes that you want to request from the authentication provider. To add a scope, call addScope. For example:    // provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  // Optional: To localize the provider's OAuth flow to the user's preferred language without explicitly passing the relevant custom OAuth parameters, update the language code on the Auth instance before starting the OAuth flow. For example:
  const auth = getAuth();
  auth.useDeviceLanguage();

  // Optional: Specify additional custom OAuth provider parameters that you want to send with the OAuth request. To add a custom parameter, call setCustomParameters on the initialized provider with an object containing the key as specified by the OAuth provider documentation and the corresponding value. For example:
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Perform login logic here

    signInWithRedirect(auth, provider);

    getRedirectResult(auth)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access Google APIs.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;

    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The email of the user's account used.
    const email = error.customData.email;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    
    // For demonstration purposes, navigate to the TaskPage
    navigate('/tasks'); // Navigate to TaskPage
  };

  return (
    <div className="container">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>🪴 Welcome to TaskGarden 🪴</h2>
        {/* <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required /> */}
        <button type="submit">Login with Google</button>
        {/* <Link to="/register">New User? Register Here</Link>
        <Link to="/forgot_password">Forgot Password?</Link>
        <Link to="/forgot_username">Forgot Username?</Link> */}
      </form>
    </div>
  );
}

export default LoginPage;