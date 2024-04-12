// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAtKmLVdXmbn3gwKqtpjlWZmSDhtF3FJeM",
  authDomain: "taskgarden-8c627.firebaseapp.com",
  projectId: "taskgarden-8c627",
  storageBucket: "taskgarden-8c627.appspot.com",
  messagingSenderId: "1047188453327",
  appId: "1:1047188453327:web:ddcdbf150ad94f34ebc4ba",
  measurementId: "G-EQZGPVZFVG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

// initialize cloud firestore 
const db = getFirestore(app);

export { db, app, auth };