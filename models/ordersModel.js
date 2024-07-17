import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    pickupDate: {
      type: Date,
      required: true,
    },

    dropoffDate: {
        type: Date,
        required: true,
    },

    pickupTime: {
      type:  String,
      required: true
    },

    dropoffTime: {
      type: String,
      required: true
    },

    drivenMethod: {
        type: String,
        enum: ["self", "driver"],
        default: "self",
        required: true,
    },

    pickupLocation: {
      type: String,
      required: true
    },

    dropoffLocation: {
      type: String,
      required: true
    },

    orderStatus: {
      type : String,
      enum: ["pending","confirmed", "pickup completed", "dropoff completed"],
      required: true,
      default: "pending"
    },

    totalPayment: {
      type : String,
    },
   
    
    payment: [{ type: mongoose.Types.ObjectId, ref: "Payment" }],
    // staff: [{ type: mongoose.Types.ObjectId, ref: "Staff" }],
    car: [{ type: mongoose.Types.ObjectId, ref: "Car" }],
    client: [{ type: mongoose.Types.ObjectId, ref: "Clients" }],
    
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;