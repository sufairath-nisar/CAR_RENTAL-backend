import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    carNumber: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["sedan", "hatchback", "crossover SUV", "large SUV"],
    },
    category: {
      type: String,
      required: true,
      enum: ["small", "medium", "crossover", "SUV", "luxury", "commercial"],
    },
    brand: { 
      type: String,
      required: true,
      enum: ["nissan", "infiniti", "KIA", "mitsubishi", "chevrolet", "renault", "hyundai", "MG", "toyota"],
    },
    carName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    km: {
      type: String,
      required: true,
      maxLength: 50,
    },
    priceperday: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    priceperweek: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    pricepermonth: {
      type: String,
      required: true,
      minLength: 2,
      maxLength: 50,
    },
    image: {
      type: String,
    },
  //   bluetooth: {
  //     type:  Boolean,
  //     default: false
  // },

  // seats: {
  //   type: Number,
  //   default: 4
  // },

  // leatherSeats: {
  //   type:  Boolean,
  //   default: false
  // },
  
  // navigation: {
  //   type:  Boolean,
  //   default: false
  // },

  // alloyWheel: {
  //   type:  Boolean,
  //   default: false
  // },

  // applePlay: {
  //   type:  Boolean,
  //   default: false
  // },

  // rearCamera: {
  //   type:  Boolean,
  //   default: false
  // },

  // keylessEntry: {
  //   type:  Boolean,
  //   default: false
  // },

  // doors: {
  //   type:  Number,
  //   default: 4
  // },

  // AUX: {
  //   type:  Boolean,
  //   default: false
  // },

  // parkingSensors: {
  //   type:  Boolean,
  //   default: false
  // },

  // airBags: {
  //   type:  Boolean,
  //   default: false
  // },

  // fogLamps: {
  //   type:  Boolean,
  //   default: false
  // },

  // cruiseControl: {
  //   type:  Boolean,
  //   default: false
  // },

  // MP3Player: {
  //   type:  Boolean,
  //   default: false
  // },

  // USB: {
  //   type:  Boolean,
  //   default: false
  // },

  // passengersCapacity: {
  //   type:  Number,
  //   default: 4 
  // },
   
    branch: [{ 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Branch",
      required: true
    }],
  features: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Features",
    required: true
  }]
    
  },
  { timestamps: true }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
