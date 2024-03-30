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
import cors from 'cors';

const app = express();
const port = 3500;

// Connect database to the app.
const db = mysql2.createConnection({
    host:"localhost",
    user:"root",
    password:"Laakeg26730!",
    database:"taskgarden"
})

app.use(express.json());
app.use(cors());

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
  const q = "INSERT INTO tasks (`id`, `title`, `desc`, `datetime`, `diff`, `priority`) VALUES (?)";

  const values = [
    req.body.id,
    req.body.title, 
    req.body.desc,
    req.body.datetime,
    req.body.diff,
    req.body.priority
    ];

  db.query(q, [values], (err, data) => {
    if(err) return res.json(err);
    return res.json("Task created successfully!");
  });
});

app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const q = "DELETE FROM tasks WHERE id = ?";

    db.query(q, [taskId], (err,data) => {
      if (err) return res.json(err);
      return res.json("Task has been deleted!");
    })
})

// Start server listening
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});