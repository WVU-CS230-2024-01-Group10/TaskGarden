// Import React and other necessary components
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/appStyle.css';
import { UserProvider } from './contexts/UserContext';

// Import page components from the /pages directory
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import TaskPage from './pages/TaskPage/TaskPage.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import Register from './pages/Register/Register.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';

/**
 *  Root component for the application
 *  Provides routes for different pages and provides user authentication context
 */
function App() {
  return (
    <div className="App">
      <div id='root'>
        {/* Provide user authentication context */}
        <UserProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />}></Route>
              <Route path="/tasks" element={<TaskPage />}></Route>
              <Route path="/register" element={<Register />}></Route>
              <Route path="/" element={<HomePage />}></Route> {/* HomePage is the landing page of the webapp. */}
              <Route path="/profile" element={<ProfilePage />}></Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </div>
    </div>
  );
}

export default App;