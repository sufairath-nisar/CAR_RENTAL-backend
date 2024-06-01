import express from "express";
import {
  getAllCars,
  getCar,
  createCar,
  updateCar,
  deleteCar
} from "../controllers/carController.js";
import upload from "../middlewares/upload-middleware.js";


const adminRouter = express.Router();

adminRouter.get("/get-all-cars", getAllCars);

adminRouter.get("/get-car", getCar);

adminRouter.post("/add-car", upload.single("image"), createCar);

adminRouter.put("/update-car/:id", updateCar);

adminRouter.delete("/delete-car/:id",  deleteCar);

export default adminRouter;