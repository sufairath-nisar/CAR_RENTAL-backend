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
import upload from "../middlewares/upload-middleware.js";


const adminRouter = express.Router();

adminRouter.get("/get-all-cars", getAllCars);

adminRouter.get("/get-a-car", getACar);

adminRouter.get("/get-car", getCar);

adminRouter.post("/add-car", upload.single('file'), createCar);

adminRouter.put("/update-car/:id", upload.single('file'), updateCar);

adminRouter.delete("/delete-car/:id",  deleteCar);



adminRouter.get("/get-all-branches", getAllBranches);

adminRouter.get("/get-branch", getBranch);

adminRouter.post("/add-branch", createBranch);

adminRouter.put("/update-branch/:id", updateBranch);

adminRouter.delete("/delete-branch/:id",  deleteBranch);


export default adminRouter;