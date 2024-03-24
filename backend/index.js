import express from "express";

const app = express();

app.listen(6000, () => {
  console.log(`Server listening at http://localhost:6000`);
});