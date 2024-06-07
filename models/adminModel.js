import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
      unique: true
    },
    hashPassword: {
      type: String,
      minLength: 6,
      required: true
    },
   
    car: [{ type: mongoose.Types.ObjectId, ref: "Car" }],
    staff: [{ type: mongoose.Types.ObjectId, ref: "Staff" }],
    orders: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;




