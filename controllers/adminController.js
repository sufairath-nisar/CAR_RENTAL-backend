import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import {adminToken} from "../utils/generateToken.js";
import Orders from "../models/ordersModel.js"


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

//get all orders
export const getAllOrders = async (req, res) => {
  try{
      const orders = await Orders.find();
      return res.send(orders);
  }
  catch (error) {
      console.log("Error fetching orders:", error);
      res.status(500).send("Failed to fetch orders details");
  }   
};

//orders update
export const updateOrders = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    
    const {  orderStatus } = body;
    const existingOrder = await Orders.findOne({id} );

    if (existingOrder) {
      return res.status(400).send("Order status cannot be updated"); 
    }
    
      const updateData = {
      orderStatus
    };

    const updateOrder = await Orders.findOneAndUpdate(
      { _id: id },
      updateData,
      {
        new: true,
      }
    );

    if (!updateOrder) {
      return res.status(404).send("Order status is not updated");
    }
    return res.status(200).send(updateOrder);
  } 
  catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send("Failed to update order status");
  }
};









