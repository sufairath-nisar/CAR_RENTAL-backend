import bcrypt from "bcrypt";
import { cloudinaryInstance } from "../config/cloudinary.js";
import Clients from "../models/clientsModel.js";
import Car from "../models/carModel.js"
import {clientToken} from "../utils/generateToken.js";
import Orders from "../models/ordersModel.js";
import Payment from "../models/paymentModel.js";



//signup
export const signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, nationality, ph, address, license, companyName, position, trn} = req.body
    console.log(email);
 
    const clientExist = await Clients.findOne({ email });
    
    
    if (clientExist) {
      return res.send("User is already exist");
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
    const { email, password } = req.body;

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



