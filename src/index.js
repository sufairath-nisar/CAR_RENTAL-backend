import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import clientsRouter from "../routes/clientsRoutes.js";
import connect from "../config/db.js"

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/v1/user", clientsRouter);

const port = 3000;
connect();

app.get("/", (req, res) => {
  res.send("server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});