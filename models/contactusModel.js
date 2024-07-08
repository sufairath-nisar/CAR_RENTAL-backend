import mongoose from "mongoose";

const contactusSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      minLength: 3,
      maxLength: 30,
      required: true,
      
    },
    subject: {
        type: String,
        minLength: 2,
        required: true,
      },
   message: {
      type: String,
      minLength: 2,
      required: true,
    },
   
 
  },
  { timestamps: true }
);

const Contactus = mongoose.model("Contactus", contactusSchema);

export default Contactus;




