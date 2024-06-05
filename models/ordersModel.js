import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    pickupDate: {
        type: DateTime,
        // required: true,
      },
    dropOffDate: {
        type: DateTime,
        // required: true,
      },
    drivenMethod: {
        type: String,
        enum: ["self", "driver"],
      },
    orderStatus: {
      type : String,
      enum: ["pending","assigned","confirmed", "completed"],
      default: "pending"
    },
    
    clients: [{ type: mongoose.Types.ObjectId, ref: "Clients" }],
    car: [{ type: mongoose.Types.ObjectId, ref: "Car" }],
    location: [{ type: mongoose.Types.ObjectId, ref: "Location" }],
    payment: [{ type: mongoose.Types.ObjectId, ref: "Payment" }],
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;