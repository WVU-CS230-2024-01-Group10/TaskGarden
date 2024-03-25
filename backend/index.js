/*
 * TaskGarden/backend/index.js
 * Version: 24 Mar 2024
 * Authors: C. Jones
 * Last Edit: C. Jones
 * TODO: Figure out why port 3000 must be killed 
 * (npx kill-port 3000) before 'npm start' can run. 
 */

import express from "express";
import mysql2 from "mysql2";

const app = express();
const port = 3000;

// Connect database to the app.
const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"Laakeg26730!",
    database:"taskgarden"
})

// handle HTTP GET req
app.get("/", (req,res) => {
  res.json("Hello World!"); // Test message
});

// handle HTTP GET tasks req
app.get("/tasks", (req,res) => {
  const q = "SELECT * FROM tasks";
  db.query(q, (err,data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
});

// handle HTTP POST task req
app.post("/tasks", (req,res) => {
  const q = "INSERT INTO tasks (`title`, `desc`, `datetime`, `diff`, `priority`) VALUES (?)"
  
  // TEST VALUES, this will change in the future
  const values = [
    "title from backend", 
    "desc from backend",
    null, 0, 0 ];

  db.query(q, [values], (err, data) => {
    if(err) return res.json(err);
    return res.json(data);
  });
});

// Start server listening
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});