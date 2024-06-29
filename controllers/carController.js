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
        const id = req.params.id; 
        console.log("Requested car ID:", id);
        const car = await Car.findById(id);
        console.log(car);
        if (!car) {
            return res.status(404).send("Car not found");
        }

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
            const feature = await Features.findOne(filters.features);
            if (feature) {
                filterCriteria.features = feature._id;
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
  
// CREATE CAR
export const createCar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("Image file is required");
        }

        cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
            console.log("{test");
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file to cloudinary",
                });
            }

            const imageUrl = result.url;
            const body = req.body;

            const { carNumber, type, category, carName, km, priceperday, priceperweek, pricepermonth, brand, branch, features } = body;

            // FIND BRAND
            let findBrand = await CarBrands.findOne({ name: brand });

            if (!findBrand) {
                findBrand = new CarBrands({ name: brand });
                await findBrand.save();
            }

            // FIND BRANCh
            let findBranch = await Branch.findOne({ name: branch });

            if (!findBranch) {
                return res.status(400).send("Please add branch details first!");
            }

            // FIND FEATURES
            let findFeatures = await Features.create(JSON.parse(features));

            const createCar = new Car({
                carNumber,
                type,
                category,
                carName,
                km,
                priceperday,
                priceperweek,
                pricepermonth,
                brand: findBrand._id,
                // branch: findBranch._id,
                features: findFeatures._id,
                image: imageUrl,
            });

            const newCarCreated = await createCar.save();
            if (!newCarCreated) {
                return res.send("Failed to add car details");
            }
            return res.send(newCarCreated);
        });
    } catch (error) {
        console.log("Something went wrong", error);
        res.status(500).send("Failed to add car details");
    }
};

// UPDATE CAR
export const updateCar = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;

        let imageUrl;

        // Check if file was provided for update
        if (req.file) {
            cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        success: false,
                        message: "Error uploading file to cloudinary",
                    });
                }
                imageUrl = result.secure_url;
            });
        }

        const { carNumber, type, category, carName, km, priceperday, priceperweek, pricepermonth, brand, branch, features } = body;

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
            priceperday,
            priceperweek,
            pricepermonth,
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
            { new: true }
        );

        if (!updateCar) {
            return res.status(404).send("Car not updated");
        }
        return res.status(200).send(updateCar);
    } catch (error) {
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

//CARS BY TYPE, BRAND AND CATEGORY

export const getCarsByType = async (req, res) => {
    try {
        const { type } = req.params;
        console.log(req.params);
        const cars = await Car.find({ type }).populate('features'); // Populate features if it's a reference in your model
        res.json(cars);
    } catch (error) {
        console.log("Error fetching cars by type:", error);
        res.status(500).json({ message: 'Error fetching cars by type', error });
    }
};

export const getCarsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const cars = await Car.find({ category });
        res.json(cars);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars by category', error });
    }
};

export const getCarsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;

        // Find the CarBrands document by name
        const carBrand = await CarBrands.findOne({ name: brand });

        if (!carBrand) {
            return res.status(404).json({ message: 'Car brand not found' });
        }

        // Query cars by brand using the brand's ObjectId
        const cars = await Car.find({ brand: carBrand._id })
        .populate('brand')
        // .populate('branch')
        .populate('features');
        res.json(cars);
    } 
    catch (error) {
        console.log("Error fetching cars by brand:", error);
        res.status(500).json({ message: 'Error fetching cars by brand', error });
    }
};