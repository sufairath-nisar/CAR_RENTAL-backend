import { cloudinaryInstance } from "../config/cloudinary.js";
import mongoose from "mongoose"
import Car from "../models/carModel.js";
// import CarBrands from "../models/carBrandsModel.js";
import Branch from "../models/branchModel.js";
import Features from "../models/featuresModel.js";


//GET ALL CAR DETAILS
export const getAllCars = async (req, res) => {
    try{
        const cars = await Car.find().populate('features');
        return res.send(cars);
    }
    catch (error) {
        console.log("Error fetching cars:", error);
        res.status(500).send("Failed to fetch car details");
    }   
};

//GET A CAR DETAILS
export const getACar = async (req, res) => {
    try {
        const id = req.params.id;
        console.log("Requested car ID:", id);

        const car = await Car.findById(id)
            .populate('branch')
            .populate('features');

        console.log(car);
        if (!car) {
            return res.status(404).send("Car not found");
        }

        res.send(car);
    } catch (error) {
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
            if (err) {
                console.log(err);
                return res.status(500).json({
                    success: false,
                    message: "Error uploading file to cloudinary",
                });
            }

            
            const imageUrl = result.url;
            const body = req.body;           
            const { 
              carNumber, 
              type, 
              category, 
              carName, 
              km, 
              priceperday, 
              priceperweek, 
              pricepermonth, 
              brand, 
              branch,
              features, 
              // bluetooth,
              // seats,
              // leatherSeats,
              // navigation,
              // alloyWheel,
              // applePlay,
              // rearCamera,
              // keylessEntry,
              // doors,
              // AUX,
              // parkingSensors,
              // airBags,
              // fogLamps,
              // cruiseControl,
              // MP3Player,
              // USB,
              // passengersCapacity 
              } = body;

            // FIND BRAND
            // let findBrand = await CarBrands.findOne({ name: brand });

            // if (!findBrand) {
            //     findBrand = new CarBrands({ name: brand });
            //     await findBrand.save();
            // }

            // FIND BRANCh
            let findBranch = await Branch.findById(branch);
            if (!findBranch) {
                return res.status(400).send("Please add branch details first!");
            }
            // Validate required fields
            if (
              !carNumber || !type || !category || !carName || !km ||
              !priceperday || !priceperweek || !pricepermonth || !brand || !branch
            ) {
              return res.status(400).send("All fields are required");
            }

            // Validate carNumber
            if (typeof carNumber !== "string" || carNumber.length < 3 || carNumber.length > 30) {
              return res.status(400).send("Invalid car number");
            }

            // Validate type
            const validTypes = ["sedan", "hatchback", "crossover SUV", "large SUV"];
            if (!validTypes.includes(type)) {
              return res.status(400).send("Invalid car type");
            }

            // Validate category
            const validCategories = ["small", "medium", "crossover", "SUV", "luxury", "commercial"];
            if (!validCategories.includes(category)) {
              return res.status(400).send("Invalid car category");
            }

            // Validate brand
            const validBrands = ["nissan", "infiniti", "KIA", "mitsubishi", "chevrolet", "renault", "hyundai", "MG", "toyota"];
            if (!validBrands.includes(brand)) {
              return res.status(400).send("Invalid brand");
            }

            // Validate carName
            if (typeof carName !== "string" || carName.length < 3 || carName.length > 50) {
              return res.status(400).send("Invalid car name");
            }

            // Validate km
            if (typeof km !== "string" || isNaN(parseInt(km)) || parseInt(km) < 0) {
              return res.status(400).send("Invalid km");
            }

            // Validate prices
            if (isNaN(parseInt(priceperday)) || isNaN(parseInt(priceperweek)) || isNaN(parseInt(pricepermonth))) {
              return res.status(400).send("Invalid pricing fields");
            }

            // Validate branch ObjectId length
            // if (typeof branch !== "string") {
            //   return res.status(400).send("Invalid branch ID format");
            // }
            console.log(body);
            
            
      console.log("new features",features);
      const featuresString = features.replace(/"/g, '"').replace(/'/g, '"').replace(/(\w+):/g, '"$1":').replace('[\n', '{').replace('\n]', '}');
      const featuresObject = JSON.parse(featuresString);
      const savedFeatures = new Features(featuresObject);
      const savedFeatureData = await savedFeatures.save();
            const createCar = new Car({
                carNumber,
                type,
                category,
                carName,
                km,
                priceperday,
                priceperweek,
                pricepermonth,
                // brand: findBrand._id,
                brand,
                branch: findBranch._id,
                features: savedFeatureData._id,
                image: imageUrl,
                // bluetooth: bluetooth === "true" || bluetooth === true,
                // seats: parseInt(seats) || 4,
                // leatherSeats: leatherSeats === "true" || leatherSeats === true,
                // navigation: navigation === "true" || navigation === true,
                // alloyWheel: alloyWheel === "true" || alloyWheel === true,
                // applePlay: applePlay === "true" || applePlay === true,
                // rearCamera: rearCamera === "true" || rearCamera === true,
                // keylessEntry: keylessEntry === "true" || keylessEntry === true,
                // doors: parseInt(doors) || 4,
                // AUX: AUX === "true" || AUX === true,
                // parkingSensors: parkingSensors === "true" || parkingSensors === true,
                // airBags: airBags === "true" || airBags === true,
                // fogLamps: fogLamps === "true" || fogLamps === true,
                // cruiseControl: cruiseControl === "true" || cruiseControl === true,
                // MP3Player: MP3Player === "true" || MP3Player === true,
                // USB: USB === "true" || USB === true,
                // passengersCapacity: parseInt(passengersCapacity) || 4,
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

// export const createCar = async (req, res) => {
//   try {

//     // const result = await cloudinaryInstance.uploader.upload(req.file.path);
//     // const imageUrl = result.url;
       
//     const {
//       carNumber,
//       type,
//       category,
//       carName,
//       km,
//       priceperday,
//       priceperweek,
//       pricepermonth,
//       brand,
//       branch,
//       bluetooth,
//       seats,
//       leatherSeats,
//       navigation,
//       alloyWheel,
//       applePlay,
//       rearCamera,
//       keylessEntry,
//       doors,
//       AUX,
//       parkingSensors,
//       airBags,
//       fogLamps,
//       cruiseControl,
//       MP3Player,
//       USB,
//       passengersCapacity,
      
//     } = req.body;

//     console.log("req.body:", req.body);
//     console.log("req.file:", req.file);

//     // Validate required fields
//     if (
//       !carNumber || !type || !category || !carName || !km ||
//       !priceperday || !priceperweek || !pricepermonth || !brand || !branch
//     ) {
//       return res.status(400).send("All fields are required");
//     }

//     // Validate carNumber
//     if (typeof carNumber !== "string" || carNumber.length < 3 || carNumber.length > 30) {
//       return res.status(400).send("Invalid car number");
//     }

//     // Validate type
//     const validTypes = ["sedan", "hatchback", "crossover SUV", "large SUV"];
//     if (!validTypes.includes(type)) {
//       return res.status(400).send("Invalid car type");
//     }

//     // Validate category
//     const validCategories = ["small", "medium", "crossover", "SUV", "luxury", "commercial"];
//     if (!validCategories.includes(category)) {
//       return res.status(400).send("Invalid car category");
//     }

//     // Validate brand
//     const validBrands = ["nissan", "infiniti", "KIA", "mistubishi", "chevrolet", "renault", "hyundai", "MG", "toyota"];
//     if (!validBrands.includes(brand)) {
//       return res.status(400).send("Invalid brand");
//     }

//     // Validate carName
//     if (typeof carName !== "string" || carName.length < 3 || carName.length > 50) {
//       return res.status(400).send("Invalid car name");
//     }

//     // Validate km
//     if (typeof km !== "string" || isNaN(parseInt(km)) || parseInt(km) < 0) {
//       return res.status(400).send("Invalid km");
//     }

//     // Validate prices
//     if (isNaN(parseInt(priceperday)) || isNaN(parseInt(priceperweek)) || isNaN(parseInt(pricepermonth))) {
//       return res.status(400).send("Invalid pricing fields");
//     }

//     // Validate branch ObjectId length
//     if (typeof branch !== "string" || branch.length !== 24) {
//       return res.status(400).send("Invalid branch ID format");
//     }

//     // Validate image file presence
//     if (!req.file) {
//       return res.status(400).send("Image file is required");
//     }

//     // Upload image to Cloudinary
    

//     // cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
//     //   console.log("{testing");
//     //   if (err) {
//     //       console.log(err);
//     //       return res.status(500).json({
//     //           success: false,
//     //           message: "Error uploading file to cloudinary",
//     //       });
//     //   }

//     //   const imageUrl = result.url;

//     // Find the branch document
//     const findBranch = await Branch.findOne({ _id: branch });
//     if (!findBranch) {
//       return res.status(400).send("Please add branch details first!");
//     }

//     // Create new car document
//     const createCar = new Car({
//       carNumber,
//       type,
//       category,
//       carName,
//       km,
//       priceperday,
//       priceperweek,
//       pricepermonth,
//       brand,
//       image,
//       bluetooth: bluetooth === "true" || bluetooth === true,
//       seats: parseInt(seats) || 4,
//       leatherSeats: leatherSeats === "true" || leatherSeats === true,
//       navigation: navigation === "true" || navigation === true,
//       alloyWheel: alloyWheel === "true" || alloyWheel === true,
//       applePlay: applePlay === "true" || applePlay === true,
//       rearCamera: rearCamera === "true" || rearCamera === true,
//       keylessEntry: keylessEntry === "true" || keylessEntry === true,
//       doors: parseInt(doors) || 4,
//       AUX: AUX === "true" || AUX === true,
//       parkingSensors: parkingSensors === "true" || parkingSensors === true,
//       airBags: airBags === "true" || airBags === true,
//       fogLamps: fogLamps === "true" || fogLamps === true,
//       cruiseControl: cruiseControl === "true" || cruiseControl === true,
//       MP3Player: MP3Player === "true" || MP3Player === true,
//       USB: USB === "true" || USB === true,
//       passengersCapacity: parseInt(passengersCapacity) || 4,
//       branch: [findBranch._id],
//     });

//     // Save car
//     const newCarCreated = await createCar.save();
//     if (!newCarCreated) {
//       return res.status(500).send("Failed to add car details");
//     }

//     return res.status(201).send(newCarCreated);
//   } catch (error) {
//     console.log("Something went wrong", error);
//     res.status(500).send("Failed to add car details");
//   }
// };
  


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

        // const findBrand = await CarBrands.findById(brand);
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
            brand,
            // brand: findBrand._id,
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
        // const cars = await Car.find({ type }).populate('features').populate('branch'); // Populate features if it's a reference in your model
        const cars = await Car.find({ type: { $regex: type.replace('-', ' '), $options: 'i' } }).populate('features').populate('branch');
        res.json(cars);
    } 
    catch (error) {
        console.log("Error fetching cars by type:", error);
        res.status(500).json({ message: 'Error fetching cars by type', error });
    }
};

export const getCarsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        console.log(req.params);
        const cars = await Car.find({ category }).populate('features').populate('branch'); // Populate features if it's a reference in your model
        res.json(cars);
    } 
    catch (error) {
        console.log("Error fetching cars by category:", error);
        res.status(500).json({ message: 'Error fetching cars by category', error });
    }
};

export const getCarsByBrand = async (req, res) => {
    try {
        const { brand } = req.params;
        console.log(req.params);
        const cars = await Car.find({ brand }).populate('features').populate('branch'); // Populate features if it's a reference in your model
        res.json(cars);
    } 
    catch (error) {
        console.log("Error fetching cars by brand:", error);
        res.status(500).json({ message: 'Error fetching cars by brand', error });
    }
};


//SEARCH
export const searchCar = async (req, res) => {
    try {
        const { brandOrName } = req.params; 
        console.log("Requested car brand or name:", brandOrName);

        // Use find to search for all cars by brand or name
        const cars = await Car.find({
            $or: [
                { brand: { $regex: new RegExp(brandOrName, "i") } },
                { carName: { $regex: new RegExp(brandOrName, "i") } }
            ]
        }).populate('features').populate('branch');

        console.log(cars);

        if (cars.length === 0) {
            return res.status(404).json({ message: "No cars found" });
        }

        res.json(cars);
    } catch (error) {
        console.log("Error fetching cars:", error);
        res.status(500).json({ message: "Failed to fetch car details" });
    } 
};
