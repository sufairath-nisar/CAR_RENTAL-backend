import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import Staff from "../models/staffModel.js"
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

//update order
export const updateOrders = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { id, orderStatus, staffId } = req.body;

    if (!id || !orderStatus || !staffId) {
      return res.status(400).json({ message: 'Missing required fields: id, orderStatus, and staffId' });
    }

    const existingOrder = await Orders.findById(orderId);

    if (!existingOrder) {
      return res.status(404).send("Order is not found");
    }

    const updateData = {
      orderStatus,
      staff: id 
    };

    const updateOrder = await Orders.findByIdAndUpdate(orderId, updateData, {
      new: true,
    }).populate('staff', 'firstName staffId position'); 

    if (!updateOrder) {
      return res.status(404).send("Order status is not updated");
    }

    return res.status(200).send(updateOrder);
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send("Failed to update order status");
  }
};

//filter order details
export const filterOrders = async (req, res) => {
  try {
    const { status, paymentMethod, pickupDate, drivenMethod, location } = req.query;
    let query = {};

    if (status) {
      query.orderStatus = status;
    }
    if (paymentMethod) {
      query['payment.method'] = paymentMethod; 
    }
    if (pickupDate) {
      query.pickupDate = pickupDate; 
    }
    if (drivenMethod) {
      query.drivenMethod = drivenMethod; 
    }
    if (location) {
      query.location = location; 
    }

    const filteredOrders = await Orders.find(query);

    return res.send(filteredOrders);
  } 
  catch (error) {
    console.log("Error filtering orders:", error);
    res.status(500).send("Failed to filter orders");
  }
};

//sort order details
export const sortOrders = async (req, res) => {
  try {
    const orders = await Orders.find()
      .populate('car client')
      .sort({
        pickupDate: 1, 
        dropOffDate: 1,
        pickupTime: 1,
        dropoffTime: 1
      });

    return res.json(orders);
  } 
  catch (error) {
    console.log("Error sorting orders:", error);
    res.status(500).send("Failed to sort orders");
  }
};









