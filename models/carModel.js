import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    carNumber: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["sedan", "hatchback", "crossover SUV", "large SUV"],
    },
    category: {
      type: String,
      required: true,
      enum: ["small", "medium", "crossover", "SUV", "luxury", "commercial"],
    },
    brand: [{ 
      type: String,
      required: true,
      enum: ["nissan", "infiniti", "KIA", "mistubishi", "chevrolet", "renault", "hyundai", "MG", "toyota"],
    }],
    carName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    km: {
      type: String,
      required: true,
      maxLength: 50,
    },
    priceperday: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    priceperweek: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    pricepermonth: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    image: {
      type: String,
    },
   
    branch: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Branch",
      required: true
    }],
    features: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Features",
      required: true
    }],
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
