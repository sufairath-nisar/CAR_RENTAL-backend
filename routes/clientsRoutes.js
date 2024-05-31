import express from "express";
import { signup, signin } from "../controllers/clientsController.js";

const clientRouter = express.Router();

clientRouter.post("/signup", signup);
clientRouter.post("/signin", signin);

export default clientRouter;