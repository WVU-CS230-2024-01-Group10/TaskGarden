import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import { UserProvider } from './contexts/UserContext';

// import pages
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import TaskPage from './pages/TaskPage/TaskPage.jsx';
import GreenHouse from './pages/GreenHouse/GreenHouse.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import StudyPage from './pages/StudyPage/StudyPage.jsx';
import Register from './pages/Register/Register.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
function App() {
  return (
    <div className="App">
      <div id='root'>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/tasks" element={<TaskPage />}></Route>
              <Route path="/greenhouse" element={<GreenHouse />}></Route>
              <Route path="/study" element={<StudyPage />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="/profile" element={<ProfilePage />}></Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
    </div>
  );
}

export default App;