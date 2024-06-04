import mongoose from "mongoose";

const featuresSchema = new mongoose.Schema(
  {
    bluetooth: {
        type:  Boolean,
        default: false
    },

    seats: {
      type: Number,
    },

    leatherSeats: {
      type:  Boolean,
      default: false
    },
    
    navigation: {
      type:  Boolean,
      default: false
    },

    alloyWheel: {
      type:  Boolean,
      default: false
    },

    applePlay: {
      type:  Boolean,
      default: false
    },

    rearCamera: {
      type:  Boolean,
      default: false
    },

    keylessEntry: {
      type:  Boolean,
      default: false
    },

    doors: {
      type:  Number
    },

    AUX: {
      type:  Boolean,
      default: false
    },

    parkingSensors: {
      type:  Boolean,
      default: false
    },

    airBags: {
      type:  Boolean,
      default: false
    },

    fogLamps: {
      type:  Boolean,
      default: false
    },

    cruiseControl: {
      type:  Boolean,
      default: false
    },

    MP3Player: {
      type:  Boolean,
      default: false
    },

    USB: {
      type:  Boolean,
      default: false
    },

    passengersCapacity: {
      type:  Number
    },
  },
  { timestamps: true }
);

const Features = mongoose.model("Features", featuresSchema);

export default Features;