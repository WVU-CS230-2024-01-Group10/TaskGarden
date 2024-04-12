import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import LoginPage from './pages/LoginPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse.jsx';
import HomePage from './pages/HomePage.jsx';
import StudyPage from './pages/StudyPage.jsx';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

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

function App() {
  return (
    <div className="App">
      <div id='root'>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<HomePage />}></Route>
            {/* DO NOT CHANGE LOGIN PATH */}
            <Route path="/" element={<LoginPage />}></Route>
            <Route path="/tasks" element={<TaskPage />}></Route>
            <Route path="/greenhouse" element={<GreenHouse />}></Route>
            <Route path="/study" element={<StudyPage />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;