import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import LoginPage from './pages/LoginPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse.jsx';
import HomePage from './pages/HomePage.jsx';
import StudyPage from './pages/StudyPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/tasks" element={<TaskPage />}></Route>
          <Route path="/greenhouse" element={<GreenHouse />}></Route>
          <Route path="/study" element={<StudyPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;