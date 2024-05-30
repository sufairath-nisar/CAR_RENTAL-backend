import express from "express";
import dotenv from "dotenv";
import connect from "../config/db.js"
dotenv.config();

const app = express();

app.use(express.json());

const port = 3000;
connect();

app.get("/", (req, res) => {
  res.send("server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});