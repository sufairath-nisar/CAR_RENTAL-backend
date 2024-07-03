import bcrypt from "bcrypt";
import { cloudinaryInstance } from "../config/cloudinary.js";
import Clients from "../models/clientsModel.js";
import Car from "../models/carModel.js"
import {clientToken} from "../utils/generateToken.js";
import Orders from "../models/ordersModel.js";
import Payment from "../models/paymentModel.js";
import dotenv from "dotenv";
import fetch from 'node-fetch';


dotenv.config();

//signup
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, nationality, ph, address, license, companyName, position, trn} = req.body
    console.log(email);
 
    const clientExist = await Clients.findOne({ email });
    
    
    if (clientExist) {
      return res.status(400).send("Email address is already registered");
    }
    
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newClient = new Clients({
      email,
      firstName,
      lastName,
      hashPassword,
      role,
      nationality,
      ph,
      address,
      license,
      companyName,
      position,
      trn
    });
    
    const newClientCreated = await newClient.save();

    if (!newClientCreated) {
      return res.send("user is not created");
    }

    const token = clientToken(email);   
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
    const { email, password,  captchaToken } = req.body;
    // Verify reCAPTCHA
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${captchaToken}`;
    const captchaResponse = await fetch(url, { method: 'POST' });
    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
    }

    const client = await Clients.findOne({ email });

    if (!client) {
      return res.status(404).send("User not found");
    }

    const matchPassword = await bcrypt.compare(password, client.hashPassword);

    if (!matchPassword) {
      return res.status(401).send("Password is not correct");
    }

    const token = clientToken(email);
    res.cookie("token", token);
    res.status(200).send("Logged in!");
  } 
  catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Internal Server Error");
  }
};


//create order
export const createOrders = async (req, res) => {
  try {
      console.log("hitted");
      const body = req.body;
      console.log(body, "body");

      const { pickupDate,dropOffDate,pickupTime,dropoffTime,drivenMethod,location,orderStatus,car,client} = body;

      //check client
      const findClient = await Clients.findById(client);
      if (!findClient) {
        return res.send("Client is not found!");
      }
     
      // check car
      const findCar = await Car.findById(car);
      console.log(findCar);
      if (!findCar) {
        return res.send("Car is not found!");
      }

      const createOrder = new Orders({
        pickupDate,
        dropOffDate,
        pickupTime,
        dropoffTime,
        drivenMethod,
        location,
        orderStatus,
        car : findCar._id,
        client : findClient._id
      });
           
      const newOrderCreated = await createOrder.save();
      if (!newOrderCreated) {
        return res.send("order details are not added");
      }
      return res.send(newOrderCreated);     
  } 
  catch (error) {
    console.log("something went wrong", error);
    res.send("failed to add order details");
  }
};


//create payment
export const createPayment = async (req, res) => {
  try {
     
      console.log("hitted");
      if(!req.file) {
        return res.status(400).send("file is not visible")
        }
      
      cloudinaryInstance.uploader.upload(req.file.path, async (err, result) => {
        if (err) {
            console.log(err, "error");
            return res.status(500).json({
            success: false,
            message: "Error uploading file to cloudinary",
            });
        }
    
      const imageUrl = result.secure_url;
      const body = req.body;
      console.log(body, "body");
      
      // const { paymentMethod, cardNum, order} = body;
      const paymentMethod = body.paymentMethod.replace(/"/g, '').trim();
      const cardNum = body.cardNum.replace(/"/g, '').trim();
      const order = body.order.replace(/"/g, '').trim();


      //check order
      const findOrder = await Orders.findById(order);
      if (!findOrder) {
        return res.send("Please make an order!");
      }
   
      const createPayment = new Payment({
        paymentMethod,
        cardNum,
        proof : imageUrl,
        order : findOrder._id
      });
           
      const newPaymentCreated = await createPayment.save();

      if (!newPaymentCreated) {
        return res.send("Payment details are not added");
      }

      if (findOrder.payment === undefined) { 
        findOrder.payment = newPaymentCreated._id;
        await findOrder.save(); 
      }
      return res.send(newPaymentCreated);    

    });

  } 
  catch (error) {
    console.log("something went wrong", error);
    res.send("failed to add payment details");
  }
};


export const getAClient = async (req, res) => {
  try {
    const { email } = req.query; // Use query parameters, not params
    console.log(req.query); // Log the query parameters to debug

    if (!email) {
      return res.status(400).send("Email query parameter is required");
    }

    const client = await Clients.findOne({ email }); // Find one client by email
    if (!client) { // Check if client is null or undefined
      return res.status(404).send("No client found with the provided email");
    }

    res.status(200).json(client); // Return the found client
  } catch (error) {
    console.log("Error fetching client:", error);
    res.status(500).send("Failed to fetch client details");
  }
};






