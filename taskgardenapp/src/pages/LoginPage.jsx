import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import '../styles/loginStyles.css';

function LoginPage() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform login logic here
    // For demonstration purposes, navigate to the TaskPage
    navigate('/tasks'); // Navigate to TaskPage
  };

  return (
    <div className="container">
      <form id="loginForm" onSubmit={handleSubmit}>
        <h2>🪴 Login to TaskGarden 🪴</h2>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">Login</button>
        <Link to="/register">New User? Register Here</Link>
        <Link to="/forgot_password">Forgot Password?</Link>
        <Link to="/forgot_username">Forgot Username?</Link>
      </form>
    </div>
  );
}

export default LoginPage;