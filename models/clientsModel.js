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
        required: true
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
    address: {
        type: String,
        required: true,
        maxLength: 50,
      },
    license: {
        type: String,
        maxLength: 50,
        required: true
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
      ph: {
        type: String,
        required: true,
        maxLength: 20,
        match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number']
      },
  },
  { timestamps: true }
);

const Clients = mongoose.model("Clients", clientsSchema);

export default Clients;