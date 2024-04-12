import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';

// import pages
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import TaskPage from './pages/TaskPage/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse/GreenHouse.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import StudyPage from './pages/StudyPage/StudyPage.jsx';
import Register from './pages/Register/Register.jsx';

function App() {
  return (
    <div className="App">
      <div id='root'>
        <BrowserRouter>
          <Routes>
            <Route path="/home" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/tasks" element={<TaskPage />}></Route>
            <Route path="/greenhouse" element={<GreenHouse />}></Route>
            <Route path="/study" element={<StudyPage />}></Route>
            <Route path="/register" element={<Register />}></Route>
            {/* For development purposes: */} <Route path="/" element={<TaskPage />}></Route> {/* (should be homepage later */}
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;