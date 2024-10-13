import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_URL);

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("mongodb connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

export default connect;


// env
// DB_URL='mongodb+srv://sufairathc:VlZ8M4dvEv4j9Nvj@cluster0.ndlxe7f.mongodb.net/'
// SECRET_KEY='sufaira8372'
// CLOUDINARY_CLOUD_NAME='dfxjs9nwa'
// CLOUDINARY_API_KEY='489195535428673'
// CLOUDINARY_API_SECRET='8AIP9wq-8Jfh2MEBkNhm9OLWzNE'


// # EMAIL_USER='sufairath.c@gmail.com'
// # EMAIL_PASS='gtnu cdnm zeil ymwz'

// RECAPTCHA_SECRET_KEY=6Ld8KwYqAAAAAPTLSjgQBmCwkE1UPMfeBSTO7HjW



// EMAIL_USER='emiratesdrive774@gmail.com'
// EMAIL_PASSWORD='jexk zkff kqti iixb'