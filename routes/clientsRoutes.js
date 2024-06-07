import express from "express";
import { signup, signin, createOrders } from "../controllers/clientsController.js";

const clientRouter = express.Router();

clientRouter.post("/signup", signup);
clientRouter.post("/signin", signin);

clientRouter.post("/create-order", createOrders);

export default clientRouter;