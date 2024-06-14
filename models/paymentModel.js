import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentMethod: {
        type: String,
        required: true,
       enum:["cash","credit card"]
    },
    proof: {
        type: String,
        
    },
    cardNum: {
        type: Number,
        maxLength: 50,
        minLength:8
    },
    order: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],
   
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;