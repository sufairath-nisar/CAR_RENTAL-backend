import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import Staff from "../models/staffModel.js";
import {adminToken} from"../utils/generateToken.js";


//signup
export const signup = async (req, res) => {
  try {
    const { username, password} = req.body
    console.log(username);
     
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newAdmin = new Admin({
      username,
      hashPassword,
      role: "admin"
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



//STAFF
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

