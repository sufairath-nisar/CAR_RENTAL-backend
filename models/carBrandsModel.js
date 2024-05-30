import mongoose from "mongoose";

const carBrandsSchema = new mongoose.Schema(
  {
   name: {
      type: String,
      required: true,
      maxLength: 50,
    },
   
  },
  { timestamps: true }
);

const CarBrands = mongoose.model("CarBrands", carBrandsSchema);

export default CarBrands;