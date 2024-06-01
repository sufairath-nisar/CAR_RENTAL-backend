import mongoose from "mongoose";

const clientsSchema = new mongoose.Schema(
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
    role: {
        type: String,
        enum: ["personal", "corporate"],
      },
    firstName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 50,
    },
    nationality: {
        type: String,
        required: true,
        maxLength: 50,
      },
    ph: {
        type: Number,
        required: true,
      },
    address: {
        type: String,
        required: true,
        maxLength: 50,
      },
    license: {
        type: String,
        maxLength: 50,
      },
    companyName: {
        type: String,
        maxLength: 50,
      },
    position: {
        type: String,
        maxLength: 50,
      },
    trn: {
        type: String,
        maxLength: 50,
      },
  },
  { timestamps: true }
);

const Clients = mongoose.model("Clients", clientsSchema);

export default Clients;