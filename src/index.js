import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import clientsRouter from "../routes/clientsRoutes.js";
import adminRouter from "../routes/adminRoutes.js";
import staffRouter from "../routes/staffRoutes.js"
import connect from "../config/db.js"
import staffRouter from "../routes/staffRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/clients", clientsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);

const port = 3000;
connect();

app.get("/", (req, res) => {
  res.send("server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});