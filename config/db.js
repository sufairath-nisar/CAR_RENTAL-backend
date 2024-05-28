import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_URL);

export const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("mongodb connected");
  } 
  catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};