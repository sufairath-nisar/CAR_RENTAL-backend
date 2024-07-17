import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentMethod: {
        type: String,
        required: true,
       enum:["cash","online"]
    },
    image: [{
      type: String,
      required: true
  }],
    // cardNum: {
    //     type: Number,
    //     maxLength: 50,
    //     minLength:8
    // },
    order: [{ type: mongoose.Types.ObjectId, ref: "Orders" }],
   
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;