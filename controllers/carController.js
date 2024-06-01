import bcrypt from "bcrypt";
import Instructor from "../models/instructorModel.js";
import { adminToken } from "../utils/generateToken.js";


//GET CAR
export const getCars = async (req, res) => {
    const cars = await Car.find();
    res.send(cars);
};

//CREATE CAR
export const createCar = async (req, res) => {
    try {
      console.log("hitted");
      if(!req.file) {
      return res.send("file is not visible")
      }
      cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
          console.log(err, "error");
          return res.status(500).json({
            success: false,
            message: "Error",
          });
        }
        
        const imageUrl = result.url;
        const body = req.body;
        console.log(body, "body");
  
        const { carNumber, type, category, carName, km, price, brand, branch, features} = body;

       //FIND BRAND
        let findBrand = await CarBrands.findOne({ name: brand });

        if (!findBrand) {
            findBrand = new CarBrands({ name: brand });
            await findBrand.save();
        }

        //FIND FEATURES
        let findFeatures = await Features.findOne({ description: features });

        if (!findFeatures) {
            findFeatures = new Features({ description: features });
            await findFeatures.save();
        }
  
        //FIND BRANCH
        const findBranch = await Branch.findOne({ name: branch});
  
        if (!findBranch) {
          return res.send("please add branch details first");
        }
  
        const createCar = new Car({
            carNumber,
            type,
            category,
            carName,
            km,
            price,
            brand: findBrand._id,
            branch: findBranch._id,
            features:  findFeatures._id,
            image: imageUrl,
        });
        
        
        const newCarCreated = await createCar.save();
        if (!newCarCreated) {
          return res.send("car details are not added");
        }
        return res.send(newCarCreated);
      });
    } 
    catch (error) {
      console.log("something went wrong", error);
      res.send("failed to add car details");
    }
  };

//UPDATE CAR DETAILS

export const updateCar = async (req, res) => {
    try{
            const id = req.params.id;
        
            const updateCar = await Car.findOneAndUpdate(
            { _id: id },
            {  carNumber, type, category, carName, km, price, brand, branch, features },
            {
                new: true,
            }
            );
        
            if (!updateCar) {
            return res.send("Car is not updated");
            }
            console.log(updateCar);
            return res.send(updateCar);
        }
        catch (error) {
            console.log("something went wrong", error);
            res.send("failed to update car details");
          }
};

//DELETE CAR DETAILS

export const deleteCourse = async (req, res) => {
    const id = req.params.id;
    const deleteId = await Course.deleteOne({ _id: id });
    if (!deleteId) {
      return res.send("not deleted");
    }
    res.send("deleted course");
  };

