import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import LoginPage from './pages/LoginPage.jsx';
import TaskPage from './pages/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse.jsx';
import HomePage from './pages/HomePage.jsx';
import StudyPage from './pages/StudyPage.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<HomePage />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/tasks" element={<TaskPage />}></Route>
          <Route path="/greenhouse" element={<GreenHouse />}></Route>
          <Route path="/study" element={<StudyPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;