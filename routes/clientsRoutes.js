import express from "express";
import { signup, signin, createOrders,createPayment } from "../controllers/clientsController.js";
import {getCar} from "../controllers/carController.js";
import upload from "../middlewares/upload-middleware.js";


const clientRouter = express.Router();

clientRouter.post("/signup", signup);
clientRouter.post("/signin", signin);

clientRouter.post("/create-order", createOrders);

clientRouter.get("/get-car", getCar); 

clientRouter.post("/add-payment/:id",upload.single('file'), createPayment);

export default clientRouter;