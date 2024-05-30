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
      minLength: 3,
      maxLength: 50,
    },
    category: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    brands: {
        type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    features: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    branch: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    price: {
        type: number,
        required: true,
        minLength: 3,
        maxLength: 50,
      },
    image: {
      type: String,
    }
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;