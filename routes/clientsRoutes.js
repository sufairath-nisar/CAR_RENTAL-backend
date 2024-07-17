import express from "express";
import dotenv from 'dotenv';
import { getAllOrders } from "../controllers/adminController.js";
import { sendEmail } from "../controllers/emailController.js";
import { signup, signin, createOrders, createPayment, changePassword, getClient, sendMessage, editProfile } from "../controllers/clientsController.js";
import { getBranchesByAddress, getAllBranches } from '../controllers/branchController.js';
import { getCar, getCarsByType, getCarsByCategory, getCarsByBrand, searchCar,getACar, getAllCars } from "../controllers/carController.js";
import upload from "../middlewares/upload-middleware.js";
import authenticateClient from "../middlewares/client-middleware.js";

dotenv.config();

const clientRouter = express.Router();

clientRouter.post("/signup",  signup);
clientRouter.post("/signin",  signin);
clientRouter.put("/change-password", authenticateClient, changePassword);
clientRouter.get("/view-profile/:email", authenticateClient, getClient);
clientRouter.put("/edit-profile/:email", authenticateClient, editProfile);


clientRouter.post("/create-order", createOrders);
clientRouter.get("/get-all-orders", getAllOrders);

clientRouter.get("/get-car", getCar);
clientRouter.get("/get-a-car/:id", getACar);
clientRouter.get("/get-cars/types/:type",  getCarsByType);
clientRouter.get("/get-cars/category/:category",  getCarsByCategory);
clientRouter.get("/get-cars/brand/:brand",  getCarsByBrand);
clientRouter.get("/search-cars/:brandOrName", searchCar);
// clientRouter.get("/get-all-cars", authenticateClient, getAllCars);

// clientRouter.post("/add-payment", upload.array('image', 10), createPayment);
// adminRouter.post("/add-car", upload.single('image'), createCar);
clientRouter.post("/add-payment", upload.array('files', 10), createPayment);


clientRouter.get("/branches/search/byAddress", authenticateClient, getBranchesByAddress);
clientRouter.get("/branches", authenticateClient, getAllBranches);

// clientRouter.get("/get-a-client", authenticateClient, getAClient);

clientRouter.post('/send-message',  authenticateClient, sendMessage);

clientRouter.post('/send-email',   sendEmail);


export default clientRouter;
