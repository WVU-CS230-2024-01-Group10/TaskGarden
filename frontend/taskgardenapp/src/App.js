import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import LoginPage from './pages/LoginPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse.jsx';
import HomePage from './pages/HomePage.jsx';
import StudyPage from './pages/StudyPage.jsx';
import Register from './pages/Register.jsx';

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
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;