import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const generateToken = (email) => {
  return jwt.sign({ data: email }, secret_key, { expiresIn: "1d" });
};

export const adminToken = (username) => {
  return jwt.sign({ data: username }, secret_key, { expiresIn: "1d" });
};

export const staffToken = (staffId) => {
  return jwt.sign({ data: staffId }, secret_key, { expiresIn: "1d" });
};
