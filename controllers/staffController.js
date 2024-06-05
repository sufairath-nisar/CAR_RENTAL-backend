import bcrypt from "bcrypt";
import Staff from "../models/staffModel.js"
import {staffToken} from"../utils/generateToken.js";


//signup
export const signupstaff = async (req, res) => {
  try {
   
    const { email, password, firstName, lastName, staffId, branch, position, ph} = req.body;
    const staffExist = await Staff.findOne({ email });
    if (staffExist) {
      return res.send("Staff is already exist");
    }
     
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newStaff = new Staff({
      email,
      hashPassword,
      role: "staff",
      firstName,
      lastName,
      staffId,
      branch,
      position,
      ph,
    });
    
    const newStaffCreated = await newStaff.save();

    if (!newStaffCreated) {
      return res.send("staff is not created");
    }

    const token = staffToken(staffId);   
    res.cookie("token", token)
    res.send("Signed successfully!");
  } 
  catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Internal Server Error");
  }
};

//signin

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ staffId });

    if (!staffId) {
      return res.send("Staff is not found");
    }

    const matchPassword = await bcrypt.compare(password, admin.hashPassword);

    if (!matchPassword) {
      return res.send("Password is not correct");
    }

    const token = staffToken(username);
    res.cookie("token", token);
    res.send("Logged in!");
  } 
  catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Internal Server Error");
  }
};
