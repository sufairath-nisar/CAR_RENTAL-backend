import mongoose from "mongoose";

const branchSchema = new mongoose.Schema(
  {
   name: {
      type: String,
      required: true,
      maxLength: 50,
    },
    address: {
        type: String,
        required: true,
        maxLength: 50,
      },
    ph: {
        type: Number,
        required: true,
        maxLength: 50,
      },
   
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;