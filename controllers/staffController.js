import bcrypt from "bcrypt";
import Staff from "../models/staffModel.js";
import Orders from "../models/ordersModel.js";
import Branch from "../models/branchModel.js";
import {staffToken} from"../utils/generateToken.js";



//signin
export const signinStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });

    if (!email) {
      return res.send("Staff is not found");
    }

    const matchPassword = await bcrypt.compare(password, staff.hashPassword);

    if (!matchPassword) {
      return res.send("Password is not correct");
    }

    const token = staffToken(email);
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

      const branchNameLowerCase = branch.toLowerCase();
      let findBranch = await Branch.findOne({ name: { $regex: new RegExp(`^${branchNameLowerCase}$`, 'i') } });
  
      if (!findBranch) {
            return res.send("Branch is not added!");
        }

        else{
                const newStaffCreated = await newStaff.save();
                if (!newStaffCreated) {
                return res.send("staff details are not added");
        }
        return res.send(newStaffCreated);
      }  
    } 
    catch (error) {
      console.log(error, "Something wrong");
      res.status(500).send("Internal Server Error");
    }
  };
  
//update staff details
 export const updateStaff = async (req, res) => {
    try{
        const id = req.params.id;
        const body = req.body;
          
        const {  firstName, lastName, staffId, branch, position, ph } = body;
        const updateData = {
            firstName, 
            lastName, 
            staffId, 
            branch, 
            position, 
            ph
        };
        
        const updateBranch = await Staff.findOneAndUpdate(
          { _id: id },
           updateData,
          {
            new: true,
          }
        );
      
        if (!updateBranch) {
          return res.send("Staff is not updated");
        }
        console.log(updateBranch);
        return res.send(updateBranch);
    }
    catch (error) {
        console.log("Something went wrong", error);
        res.status(500).send("Failed to update branch details");
      }
   
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
        res.send(staff);
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
        const deleteId = await Staff.deleteOne({ _id: id });
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

//get assigned orders
export const getAssignedOrders = async (req, res) => {
  try {
    const staffId = req.params.id; 

    const staff = await Staff.findById(staffId);
    if (!staff) {
      return res.send("Staff not found");
    }
    
    const orders = await Orders.find({ staff: staff._id }).populate("car client").sort({ pickupDate: 1 });

    return res.send(orders);
  } catch (error) {
    console.log("Error fetching assigned orders:", error);
    res.status(500).send("Failed to fetch assigned orders");
  }
};

//update order
export const updateOrderByStaff = async (req, res) => {
  try {
    const id = req.params.id;
    const { orderStatus, staffId } = req.body;

    const existingOrder = await Orders.findById(id);
    if (!existingOrder) {
       return res.status(404).send("Order is not found");
    }

    if (staffId) {
      const staffExists = await Staff.findById(staffId);
      if (!staffExists) {
        return res.status(404).send("Staff member is not found");
      }
    }

    const allowedStatuses = ["confirmed", "pickup completed", "dropoff completed"];
    
    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return res.status(400).send("Invalid order status. Staff can only update to 'confirmed', 'pickup completed', or 'dropoff completed'.");
    }

    const updateData = {
      orderStatus,
    };

    if (staffId) {
      updateData.staff = staffId;
    }

    const updatedOrder = await Orders.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('staff'); 

    if (!updatedOrder) {
      return res.status(404).send("Order is not updated");
    }

    return res.status(200).send(updatedOrder);
  } 
  catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send("Failed to update order status");
  }
};



  
