import express from "express";

import {signinStaff, getAssignedOrders, updateOrderByStaff} from "../controllers/staffController.js";


const staffRouter = express.Router();

staffRouter.post("/signin-staff", signinStaff);
staffRouter.get("/get-assigned-orders/:id", getAssignedOrders);
staffRouter.put("/update-order-by-staff/:id", updateOrderByStaff);


export default staffRouter;