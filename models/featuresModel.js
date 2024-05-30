import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema(
  {
    description: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
      }
   
  },
  { timestamps: true }
);

const Features = mongoose.model("Features", featuresSchema);

export default Features;