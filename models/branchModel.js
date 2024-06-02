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
        type: String,
        required: true,
        maxLength: 20,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
      }
  },
  { timestamps: true }
);

const Branch = mongoose.model("Branch", branchSchema);

export default Branch;