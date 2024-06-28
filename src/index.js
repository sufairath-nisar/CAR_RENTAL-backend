import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import clientsRouter from "../routes/clientsRoutes.js";
import adminRouter from "../routes/adminRoutes.js";
import staffRouter from "../routes/staffRoutes.js"
import connect from "../config/db.js"


dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = 3000;
connect();

const corsOptions ={
  origin:'http://localhost:5173', 
  credentials:true,          
  optionSuccessStatus:200
}
app.use(cors(corsOptions));

app.use("/api/v1/clients", clientsRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/staff", staffRouter);



app.get("/", (req, res) => {
  res.send("server is running!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});