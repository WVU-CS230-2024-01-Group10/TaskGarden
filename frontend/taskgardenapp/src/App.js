import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage.jsx';
import TaskPage from './pages/TaskPage.jsx';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />}></Route>
          <Route path="/tasks" element={<TaskPage />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;