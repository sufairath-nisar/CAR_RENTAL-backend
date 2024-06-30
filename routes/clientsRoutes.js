import express from "express";
import dotenv from 'dotenv';
import { signup, signin, createOrders,createPayment } from "../controllers/clientsController.js";
import { getBranchesByAddress, getAllBranches } from '../controllers/branchController.js';
import { sendEmail } from '../controllers/emailController.js';
import {getCar, getCarsByType, getCarsByCategory, getCarsByBrand, searchCar, getAllCars} from "../controllers/carController.js";
import upload from "../middlewares/upload-middleware.js";



const clientRouter = express.Router();

clientRouter.post("/signup", signup);
clientRouter.post("/signin", signin);

clientRouter.post("/create-order", createOrders);

clientRouter.get("/get-car", getCar); 
clientRouter.get("/get-cars/types/:type", getCarsByType);
clientRouter.get("/get-cars/category/:category", getCarsByCategory);
clientRouter.get("/get-cars/brand/:brand", getCarsByBrand);
clientRouter.get("/search-cars/:brandOrName", searchCar);
clientRouter.get("/get-all-cars", getAllCars);

clientRouter.post("/add-payment",upload.single('file'), createPayment);

clientRouter.get("/branches/search/byAddress", getBranchesByAddress);
clientRouter.get("/branches", getAllBranches);

clientRouter.post('/send-email', sendEmail);

export default clientRouter;