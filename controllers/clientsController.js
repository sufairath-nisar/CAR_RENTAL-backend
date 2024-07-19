import bcrypt from "bcrypt";
import { cloudinaryInstance } from "../config/cloudinary.js";
import Clients from "../models/clientsModel.js";
import Car from "../models/carModel.js"
import {clientToken} from "../utils/generateToken.js";
import Orders from "../models/ordersModel.js";
import Payment from "../models/paymentModel.js";
import dotenv from "dotenv";
import fetch from 'node-fetch';
import Contactus from "../models/contactusModel.js";
import { parseISO } from 'date-fns';


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

    const token = clientToken({ email, role });
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({ message: "Signed up successfully!", token });
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

  // Generate JWT token
  const token = clientToken({ email, role: client.role });
    
  // Set token in HTTP-only cookie
  res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'strict' });

  console.log('User logged in:', email);
  res.status(200).json({ message: "Logged in successfully!", token ,email, clientId: client._id});
 
  } 
  catch (error) {
    console.log(error, "Something wrong");
    res.status(500).send("Internal Server Error");
  }
};


//create order
// export const createOrders = async (req, res) => {
//   try {
//       console.log("hitted");
//       const body = req.body;
//       console.log(body, "body");

//       const { pickupDate,dropoffDate,pickupTime,dropoffTime,drivenMethod,pickupLocation,dropoffLocation,orderStatus,car,client} = body;

//       //check client
//       const findClient = await Clients.findById(client);
//       if (!findClient) {
//         return res.send("Client is not found!");
//       }
     
//       // check car
//       const findCar = await Car.findById(car);
//       console.log(findCar);
//       if (!findCar) {
//         return res.send("Car is not found!");
//       }

//       const createOrder = new Orders({
//         pickupDate,
//         dropoffDate,
//         pickupTime,
//         dropoffTime,
//         drivenMethod,
//         pickupLocation,
//         dropoffLocation,
//         orderStatus,
//         car : findCar._id,
//         client : findClient._id
//       });
           
//       const newOrderCreated = await createOrder.save();
//       if (!newOrderCreated) {
//         return res.send("order details are not added");
//       }
//       return res.send(newOrderCreated);     
//       console.log(newOrderCreated);
//   } 
//   catch (error) {
//     console.log("something went wrong", error);
//     res.send("failed to add order details");
//   }
// };


export const createOrders = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const {
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      drivenMethod,
      pickupLocation,
      dropoffLocation,
      orderStatus,
      totalPayment,
      car,
      client
    } = req.body;
    console.log("backend pickup date", pickupDate)

    // Check if the client exists
    const findClient = await Clients.findById(client);
    if (!findClient) {
      return res.status(404).send("Client not found!");
    }

    // Check if the car exists
    const findCar = await Car.findById(car);
    if (!findCar) {
      return res.status(404).send("Car not found!");
    }

    
    // Parse dates to ensure they are stored correctly in the database
    const parsedPickupDate = parseISO(pickupDate);
    const parsedDropoffDate = parseISO(dropoffDate);

    const createOrder = new Orders({
      pickupDate: parsedPickupDate,
      dropoffDate: parsedDropoffDate,
      pickupTime,
      dropoffTime,
      drivenMethod,
      pickupLocation,
      dropoffLocation,
      orderStatus,
      totalPayment,
      car: findCar._id,
      client: findClient._id,
      
    });

    console.log("after parsed pickup date backend", pickupDate);

    const newOrderCreated = await createOrder.save();
    if (!newOrderCreated) {
      return res.status(500).send("Failed to add order details");
    }

    console.log('New Order Created:', newOrderCreated);
    return res.status(200).json(newOrderCreated);
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).send("Failed to add order details");
  }
};

//create payment


// export const createPayment = async (req, res) => {
//   try {
//     console.log("hitted");

//     if (!req.files || req.files.length < 4) {
//       return res.status(400).send("Please upload at least 4 images.");
//     }

//     const uploadPromises = req.files.map(file => {
//       return new Promise((resolve, reject) => {
//         cloudinaryInstance.uploader.upload(file.path, (err, result) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(result.secure_url);
//           }
//         });
//       });
//     });

//     const imageUrls = await Promise.all(uploadPromises);
//     const { paymentMethod, order } = req.body;

//     const findOrder = await Orders.findById(order);
//     if (!findOrder) {
//       return res.status(400).send("Please make an order!");
//     }

//     const createPayment = new Payment({
//       paymentMethod,
//       image: imageUrls,
//       order: findOrder._id
//     });

//     const newPaymentCreated = await createPayment.save();

//     if (!newPaymentCreated) {
//       return res.status(500).send("Payment details are not added");
//     }

//     if (findOrder.payment === undefined) { 
//       findOrder.payment = newPaymentCreated._id;
//       await findOrder.save(); 
//     }

//     if (paymentMethod === "cash") {
//       findOrder.orderStatus = "confirmed";
//       await findOrder.save();
//     }

//     return res.status(200).send(newPaymentCreated);

//   } catch (error) {
//     console.error("something went wrong", error);
//     res.status(500).send("failed to add payment details");
//   }
// };
 
export const createPayment = async (req, res) => {
  try {
    console.log("hitted");

    if (!req.files || req.files.length < 4) {
      return res.status(400).send("Please upload at least 4 files.");
    }

    const uploadPromises = req.files.map(file => {
      return new Promise((resolve, reject) => {
        cloudinaryInstance.uploader.upload(file.path, { resource_type: "auto" }, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result.secure_url);
          }
        });
      });
    });

    const fileUrls = await Promise.all(uploadPromises);
    const { paymentMethod, order } = req.body;

    const findOrder = await Orders.findById(order);
    if (!findOrder) {
      return res.status(400).send("Please make an order!");
    }

    const createPayment = new Payment({
      paymentMethod,
      image: fileUrls,
      order: findOrder._id
    });

    const newPaymentCreated = await createPayment.save();

    if (!newPaymentCreated) {
      return res.status(500).send("Payment details are not added");
    }

    if (findOrder.payment === undefined) { 
      findOrder.payment = newPaymentCreated._id;
      await findOrder.save(); 
    }

    if (paymentMethod === "cash") {
      findOrder.orderStatus = "confirmed";
      await findOrder.save();
    }

    return res.status(200).send(newPaymentCreated);

  } catch (error) {
    console.error("Something went wrong:", error);
    res.status(500).send("Failed to add payment details: " + error.message);
  }
};


// export const getAClient = async (req, res) => {
//   try {
//     const { email } = req.query; // Use query parameters, not params
//     console.log(req.query); // Log the query parameters to debug

//     if (!email) {
//       return res.status(400).send("Email query parameter is required");
//     }

//     const client = await Clients.findOne({ email }); // Find one client by email
//     if (!client) { // Check if client is null or undefined
//       return res.status(404).send("No client found with the provided email");
//     }

//     res.status(200).json(client); // Return the found client
//   } catch (error) {
//     console.log("Error fetching client:", error);
//     res.status(500).send("Failed to fetch client details");
//   }
// };

export const getAClient = async (req, res) => {
  try {
    const email = req.query.email;
    console.log(`Fetching client with email: ${email}`); // Debugging log
    const client = await Clients.findOne({ email });
    if (!client) {
      console.log("Client not found");
      return res.status(404).send("Client not found");
    }
    res.send(client);
  } catch (error) {
    console.log("Error fetching client details:", error);
    res.status(500).send("Failed to fetch client details");
  }
};




// change password
// export const changePassword = async (req, res) => {
//   try {
//     const { email, currentPassword, newPassword } = req.body;

//     // Find the client by email
//     const client = await Clients.findOne({ email });

//     if (!client) {
//       return res.status(404).send('Client not found');
//     }

//     // Verify current password
//     const matchPassword = await bcrypt.compare(currentPassword, client.hashPassword);
//     if (!matchPassword) {
//       return res.status(401).send('Current password is incorrect');
//     }

//     // Hash the new password
//     const saltRounds = 10;
//     const hashPassword = await bcrypt.hash(newPassword, saltRounds);

//     // Update client's password
//     client.hashPassword = hashPassword;
//     await client.save();

//     res.status(200).send('Password changed successfully');
//   } catch (error) {
//     console.error('Error changing password:', error);
//     res.status(500).send('Failed to change password');
//   }
// };


export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword } = req.body;

    // Find the client by email
    const client = await Clients.findOne({ email });

    if (!client) {
      return res.status(404).send('Client not found');
    }

    // Verify current password
    const matchPassword = await bcrypt.compare(currentPassword, client.hashPassword);
    if (!matchPassword) {
      return res.status(401).send('Current password is incorrect');
    }

    // Hash the new password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update client's password
    client.hashPassword = hashPassword;
    await client.save();

    res.status(200).send('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).send('Failed to change password');
  }
};


// Get client details
export const getClient = async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Fetching client with email: ${email}`); // Debugging log
    const client = await Clients.findOne({ email });
    if (!client) {
      console.log("Client not found");
      return res.status(404).send("Client not found");
    }
    res.send(client);
  } catch (error) {
    console.log("Error fetching client details:", error);
    res.status(500).send("Failed to fetch client details");
  }
};



// Function to send a message
export const sendMessage = async (req, res) => {
  console.log("tetsing");
  const { email, subject,  message } = req.body;
  console.log('Request Body:', req.body); // Log request body

  // Validate input fields
  if (!email || !subject || !message) {
    return res.status(400).json({ message: 'All fields are required!' });
  }

  try {
    // Create a new message document
    const newMessage = new Contactus({
      email,
      subject,
      message,
    });

    // Save the message to the database
    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully!' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Error sending message. Please try again later!' });
  }
};


//Edit clients details
// export const editProfile = async (req, res) => {
//   try {
//     const { email } = req.params;
//     const {
   
//       firstName,
//       lastName,
//       nationality,
//       address,
//       license,
//       companyName,
//       position,
//       trn,
//       ph
//     } = req.body;

//     // Find the client by ID
//     const client = await Clients.findOne(email);

//     if (!client) {
//       return res.status(404).send('Client not found');
//     }

//     // Update the client's profile fields
   
//     client.firstName = firstName || client.firstName;
//     client.lastName = lastName || client.lastName;
//     client.nationality = nationality || client.nationality;
//     client.address = address || client.address;
//     client.license = license || client.license;
//     client.ph = ph || client.ph;

//     // Only update company-related fields if the role is corporate
//     if (client.role === 'corporate') {
//       client.companyName = companyName || client.companyName;
//       client.position = position || client.position;
//       client.trn = trn || client.trn;
//     }

//     // Save the updated client profile
//     const updatedClient = await Clients.save();

//     res.json({
//       _id: updatedClient._id,
//       email: updatedClient.email,
//       role: updatedClient.role,
//       firstName: updatedClient.firstName,
//       lastName: updatedClient.lastName,
//       nationality: updatedClient.nationality,
//       address: updatedClient.address,
//       license: updatedClient.license,
//       companyName: updatedClient.companyName,
//       position: updatedClient.position,
//       trn: updatedClient.trn,
//       ph: updatedClient.ph,
//       createdAt: updatedClient.createdAt,
//       updatedAt: updatedClient.updatedAt,
//     });

//     console.log(res.json);
//   } catch (error) {
//     console.error('Error editing profile:', error);
//     res.status(500).send('Failed to edit profile');
//   }
// };


export const editProfile = async (req, res) => {
    try{
       
        const { email } = req.params.email;
        const {
       
          firstName,
          lastName,
          nationality,
          address,
          license,
          companyName,
          position,
          trn,
          ph
        } = req.body;


        const updateData = {
          firstName,
          lastName,
          nationality,
          address,
          license,
          companyName,
          position,
          trn,
          ph
        };
        
        const update = await Clients.findOneAndUpdate(
          { _email: email },
           updateData,
          {
            new: true,
          }
        );

          if (!update) {
              return res.status(404).send("Profile is not edited");
          }

          return res.status(200).send(updateData);
      
       
    }
    catch (error) {
        console.log("Something went wrong", error);
        res.status(500).send("Failed to edit profile details");
      }
   
};




