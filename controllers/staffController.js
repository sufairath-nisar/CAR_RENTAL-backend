import bcrypt from "bcrypt";
import Staff from "../models/staffModel.js"
import {staffToken} from"../utils/generateToken.js";



//signin
export const signinStaff = async (req, res) => {
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

//staff signup
export const signupStaff = async (req, res) => {
    try {
     
      const { email, password, firstName, lastName, staffId, branch, position, ph} = req.body;
      const staffExist = await Staff.findOne({ email });
      if (staffExist) {
        return res.send("Staff is already exist");
      }
  
      const staffIdExist = await Staff.findOne({ staffId });
      if (staffIdExist) {
        return res.send("Staff Id is already in use");
      }
       
      const saltRounds = 10;
      const hashPassword = await bcrypt.hash(password, saltRounds);
  
      const newStaff = new Staff({
        email,
        hashPassword,
        firstName,
        lastName,
        staffId,
        branch,
        position,
        ph,
      });
      
      const newStaffCreated = await newStaff.save();
  
      if (!newStaffCreated) {
        return res.send("staff details are not added");
      }
  
      return res.send(newStaffCreated);
    } 
    catch (error) {
      console.log(error, "Something wrong");
      res.status(500).send("Internal Server Error");
    }
  };
  
  //update staff details
  export const updateStaff = async (req, res) => {
    const id = req.params.id;
    
    const updateStaff = await Staff.findOneAndUpdate(
      { _id: id },
      { firstName, lastName, staffId, branch, position, ph },
      {
        new: true,
      }
    );
  
    if (!updateStaff) {
      return res.send("Staff is not updated");
    }
    console.log(updateStaff);
    return res.send(updateStaff);
  };
  
  //get all staff details
  export const getAllStaff = async (req, res) => {
    try{
        const staff = await Staff.find();
        return res.send(staff);
    }
    catch (error) {
        console.log("Error fetching all staff members:", error);
        res.status(500).send("Failed to fetch staff details");
    }   
  };
  
  //get a staff details
  export const getStaff = async (req, res) => {
    try{
        const id = req.params.id;
        const staff = await Staff.findById(id)
        res.send(staffRouter);
    }
    catch (error) {
        console.log("Error fetching staff details:", error);
        res.status(500).send("Failed to fetch staff details");
    } 
  };
  
  //delete staff 
  export const deleteStaff = async (req, res) => {
    try{
        const id = req.params.id;
        const deleteId = await Car.deleteOne({ _id: id });
        if (!deleteId) {
          return res.send("not deleted"); 
        }
        res.send("deleted staff details");
    }
    catch (error) {
        console.log("something went wrong", error);
        res.send("failed to delete staff details");
    }   
  };
  
