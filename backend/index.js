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
  res.json("/tasks => taskgarden.tasks | /points => taskgarden.points");
});

// handle HTTP GET tasks req
app.get("/tasks", (req,res) => {
  const q = "SELECT * FROM tasks";
  db.query(q, (err,data) => {
    if (err) return res.json(err);
    return res.json(data);
  })
});

// handle HTTP GET points req
app.get("/points", (req,res) => {
  const q = "SELECT total_points FROM points";
  db.query(q, (err,data) => {
      if (err) return res.json(err);
      if (data.length > 0) {
          return res.json({ points: data[0].total_points });
      } else {
          // If no row exists, return 0 points
          return res.json({ points: 0 });
      }
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

// handle HTTP POST points req
app.post("/points", (req, res) => {
  const newPoints = req.body.points;
  const q = "UPDATE points SET total_points = ?";

  db.query(q, [newPoints], (err, data) => {
    if (err) return res.json(err);
    return res.json(`Points updated successfully to ${newPoints}`);
  });
});


// handle HTTP DELETE task req
app.delete("/tasks/:id", (req, res) => {
    const taskId = req.params.id;
    const q = "DELETE FROM tasks WHERE id = ?";

    db.query(q, [taskId], (err,data) => {
      if (err) return res.json(err);
      return res.json("Task has been deleted!");
    })
})

// handle HTTP DELETE points req
// this is currently completely pointless code but it may be useful in the future when creating a way to actually spend points
app.delete("/points/:id", (req, res) => {
  const taskId = req.params.id;
  const q = "DELETE FROM points WHERE id = ?";

  db.query(q, [pointsId], (err,data) => {
    if (err) return res.json(err);
    return res.json("Task has been deleted!");
  })
})

// Start server listening
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});