import express from "express";
import {
  getAllCars,
  getACar,
  getCar,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/carController.js";

import {
  getAllBranches,
  getBranch,                 
  createBranch,
  updateBranch,
  deleteBranch
} from "../controllers/branchController.js";

import {
  signupStaff,
  getAllStaff,
  getStaff,                 
  updateStaff,
  deleteStaff
} from "../controllers/staffController.js";

import { signup, 
         signin, 
         getAllOrders, 
         updateOrders,
         sortOrders,
         filterOrders } from "../controllers/adminController.js";

import upload from "../middlewares/upload-middleware.js";


const adminRouter = express.Router();

adminRouter.post("/signup", signup);
adminRouter.post("/signin", signin);


//CAR
adminRouter.get("/get-all-cars", getAllCars);
adminRouter.get("/get-a-car/:id", getACar);
adminRouter.get("/get-car", getCar);

adminRouter.post("/add-car", upload.single('file'), createCar);

adminRouter.put("/update-car", upload.single('file'), updateCar);

adminRouter.delete("/delete-car/:id",  deleteCar);


//BRANCH
adminRouter.get("/get-all-branches", getAllBranches);
adminRouter.get("/get-branch/:id", getBranch);

adminRouter.post("/add-branch", createBranch);

adminRouter.put("/update-branch/:id", updateBranch);

adminRouter.delete("/delete-branch/:id",  deleteBranch);



//STAFF
adminRouter.post("/signup-staff", signupStaff);

adminRouter.get("/get-all-staff", getAllStaff);
adminRouter.get("/get-staff/:id", getStaff);

adminRouter.put("/update-staff/:id", updateStaff);

adminRouter.delete("/delete-staff/:id",  deleteStaff);


//ORDERS  
adminRouter.get("/get-all-orders", getAllOrders);
adminRouter.put("/update-order/:id", updateOrders);
adminRouter.get("/filter-orders", filterOrders);
adminRouter.get("/sort-orders", sortOrders);

export default adminRouter;