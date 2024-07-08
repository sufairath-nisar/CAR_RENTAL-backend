import express from "express";
import dotenv from 'dotenv';
import { signup, signin, createOrders, createPayment, changePassword, getClient, getAClient, sendMessage } from "../controllers/clientsController.js";
import { getBranchesByAddress, getAllBranches } from '../controllers/branchController.js';
import { getCar, getCarsByType, getCarsByCategory, getCarsByBrand, searchCar, getAllCars } from "../controllers/carController.js";
import upload from "../middlewares/upload-middleware.js";
import authenticateClient from "../middlewares/client-middleware.js";

dotenv.config();

const clientRouter = express.Router();

clientRouter.post("/signup", signup);
clientRouter.post("/signin", signin);
clientRouter.put("/change-password", authenticateClient, changePassword);
clientRouter.get("/view-profile/:email", authenticateClient, getClient);

clientRouter.post("/create-order", authenticateClient, createOrders);

clientRouter.get("/get-car", authenticateClient, getCar);
clientRouter.get("/get-cars/types/:type", authenticateClient, getCarsByType);
clientRouter.get("/get-cars/category/:category", authenticateClient, getCarsByCategory);
clientRouter.get("/get-cars/brand/:brand", authenticateClient, getCarsByBrand);
clientRouter.get("/search-cars/:brandOrName", authenticateClient, searchCar);
// clientRouter.get("/get-all-cars", authenticateClient, getAllCars);

clientRouter.post("/add-payment", authenticateClient, upload.single('file'), createPayment);

clientRouter.get("/branches/search/byAddress", authenticateClient, getBranchesByAddress);
clientRouter.get("/branches", authenticateClient, getAllBranches);

clientRouter.get("/get-a-client", authenticateClient, getAClient);

clientRouter.post('/send-message',  authenticateClient, sendMessage);

export default clientRouter;
