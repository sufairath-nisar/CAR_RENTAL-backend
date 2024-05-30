import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
    {
        location: {
            type: { 
                type: String, 
                default: 'Point' 
            },
            coordinates:{
                type: [Number],
                required: true
            }
            
        }
    }, 
    { timestamps: true }
);

const Location = mongoose.model("Location", locationSchema);

export default Location;