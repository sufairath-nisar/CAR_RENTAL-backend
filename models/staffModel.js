import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 30,
      },
    hashPassword: {
      type: String,
      required: true,
      minLength: 6,
    },
    firstName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
    },
    staffId: {
        type: String,
        required: true,
        unique: true,
        minLength: 3,
        maxLength: 10,
      },
    branch: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
      },
    position: {
        type: String,
        required: true,
        maxLength: 50,
      },
    ph: {
        type: String,
        required: true,
        maxLength: 20,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
      },
      
    orders: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],
  },
  { timestamps: true }
);

const Staff = mongoose.model("Staff", staffSchema);

export default Staff;