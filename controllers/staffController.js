import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import Staff from "../models/staffModel.js"
import {staffToken} from"../utils/generateToken.js";


//signup
export const signup = async (req, res) => {
  try {
    const { username, password} = req.body
    console.log(username);
     
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newStaff = new Admin({
      username,
      hashPassword,
      role: "staff",
      firstName,
      lastName,
      staffId,
      branch,
      position,
      ph,
    });
    
    const newAdminCreated = await newAdmin.save();

    if (!newAdminCreated) {
      return res.send("admin is not created");
    }

    const token = adminToken(username);   
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
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.send("Admin is not found");
    }

    const matchPassword = await bcrypt.compare(password, admin.hashPassword);

    if (!matchPassword) {
      return res.send("Password is not correct");
    }

    const token = adminToken(username);
    res.cookie("token", token);
    res.send("Logged in!");
  } 
  catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Internal Server Error");
  }
};
