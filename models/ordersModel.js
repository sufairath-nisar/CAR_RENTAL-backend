import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    pickupDate: {
      type: Date,
      required: true,
    },

    dropOffDate: {
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

    location: {
        type: { 
            type: String, 
            default: 'Point' 
        },
        coordinates:{
            type: [Number],
            required: true
        }
    },

    orderStatus: {
      type : String,
      enum: ["pending","assigned","confirmed", "pickup completed", "dropoff completed"],
      required: true,
      default: "pending"
    },
    
    payment: [{ type: mongoose.Types.ObjectId, ref: "Payment" }],
    staff: [{ type: mongoose.Types.ObjectId, ref: "Staff" }],
    car: [{ type: mongoose.Types.ObjectId, ref: "Car" }],
    client: [{ type: mongoose.Types.ObjectId, ref: "Clients" }],
    
  },
  { timestamps: true }
);

const Orders = mongoose.model("Orders", ordersSchema);

export default Orders;