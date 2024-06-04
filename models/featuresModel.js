import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema(
  {
    bluetooth: {
        type:  Boolean
    },

    leatherSeats: {
      type:  Boolean
    },
    
    navigation: {
      type:  Boolean
    },

    alloyWheel: {
      type:  Boolean
    },

    applePlay: {
      type:  Boolean
    },

    rearCamera: {
      type:  Boolean
    },

    keylessEntry: {
      type:  Boolean
    },

    doors: {
      type:  Number
    },

    AUX: {
      type:  Boolean
    },

    parkingSensors: {
      type:  Boolean
    },

    airBags: {
      type:  Boolean
    },

    fogLamps: {
      type:  Boolean
    },

    cruiseControl: {
      type:  Boolean
    },

    MP3Player: {
      type:  Boolean
    },

    passengersCapacity: {
      type:  Number
    },
  },
  { timestamps: true }
);

const Features = mongoose.model("Features", featuresSchema);

export default Features;