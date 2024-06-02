import { cloudinaryInstance } from "../config/cloudinary.js";
import Car from "../models/carModel.js";
import CarBrands from "../models/carBrandsModel.js";
import Branch from "../models/branchModel.js";
import Features from "../models/featuresModel.js";

//GET ALL CAR DETAILS
export const getAllCars = async (req, res) => {
    try{
        const cars = await Car.find();
        return res.send(cars);
    }
    catch (error) {
        console.log("Error fetching cars:", error);
        res.status(500).send("Failed to fetch car details");
    }   
};

//GET A CAR DETAILS
export const getACar = async (req, res) => {
    try{
        const car = await Car.findById(id)
        res.send(car);
    }
    catch (error) {
        console.log("Error fetching car:", error);
        res.status(500).send("Failed to fetch car details");
    } 
  };

// FILTER
export const getCar = async (req, res) => {
    try {
        const filters = req.query;
        const filterCriteria = {};

        
        if (filters.brand) {
            const brand = await CarBrands.findOne({ name: filters.brand });
            if (brand) {
                filterCriteria.brand = brand._id;
            }
        }
        if (filters.type) {
            filterCriteria.type = filters.type;
        }
        if (filters.minPrice) {
            filterCriteria.price = { ...filterCriteria.price, $gte: filters.minPrice };
        }
        if (filters.maxPrice) {
            filterCriteria.price = { ...filterCriteria.price, $lte: filters.maxPrice };
        }
        if (filters.minKm) {
            filterCriteria.km = { ...filterCriteria.km, $gte: filters.minKm };
        }
        if (filters.maxKm) {
            filterCriteria.km = { ...filterCriteria.km, $lte: filters.maxKm };
        }
        if (filters.branch) {
            const branch = await Branch.findOne({ name: filters.branch });
            if (branch) {
                filterCriteria.branch = branch._id;
            }
        }
        if (filters.features) {
            const features = await Features.findOne({ description: filters.features });
            if (features) {
                filterCriteria.features = features._id;
            }
        }

        const cars = await Car.find(filterCriteria);
        res.send(cars);
       
    } 
    catch (error) {
        console.log("Error fetching cars:", error);
        res.status(500).send("Failed to fetch car details");
    }
};
  

//CREATE CAR
export const createCar = async (req, res) => {
    try {
      console.log("hitted");
      if(!req.file) {
      return res.status(400).send("file is not visible")
      }

        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.log(err, "error");
                return res.status(500).json({
                success: false,
                message: "Error uploading file to cloudinary",
                });
            }
        
        const imageUrl = result.secure_url;
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
  
        // FIND BRANCH
        let findBranch = await Branch.findOne({ name: branch});
  
        if (!findBranch) {
            return res.send("please add branch details first!");
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


export const updateCar = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
  
      const { carNumber, type, category, carName, km, price, brand, branch, features } = body;
  
      let imageUrl;
      
      cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.log(err, "error");
                return res.status(500).json({
                success: false,
                message: "Error uploading file to cloudinary",
                });
            }
        })

        
        const findBrand = await CarBrands.findById(brand);
        
        const findFeatures = await Features.findById(features);

        const findBranch = await Branch.findById(branch);

        if (!findBrand || !findFeatures || !findBranch) {
            return res.status(400).send("Invalid brand, feature, or branch provided");
          }

      const updateData = {
        carNumber,
        type,
        category,
        carName,
        km,
        price,
        brand: findBrand._id,
        branch: findBranch._id,
        features: findFeatures._id,
      };
  
      if (imageUrl) {
        updateData.image = imageUrl;
      }
  
      const updateCar = await Car.findOneAndUpdate(
        { _id: id },
        updateData,
        {
          new: true,
        }
      );
  
      if (!updateCar) {
        return res.status(404).send("Car not updated");
      }
      return res.status(200).send(updateCar);
    } 
    catch (error) {
      console.log("Something went wrong", error);
      res.status(500).send("Failed to update car details");
    }
  };
  

//DELETE CAR DETAILS
export const deleteCar = async (req, res) => {
    try{
        const id = req.params.id;
        const deleteId = await Car.deleteOne({ _id: id });
        if (!deleteId) {
          return res.send("not deleted");
        }
        res.send("deleted car details");
    }
    catch (error) {
        console.log("something went wrong", error);
        res.send("failed to update car details");
    }
   
};

