import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const clientToken = (user) => {
  return jwt.sign({ data: user.email, role: user.role }, secret_key, {
    expiresIn: "1d",
  });
};

export const adminToken = (user) => {
  return jwt.sign({ data: user.username, role: user.role }, secret_key, {expiresIn: "1d" });
};

export const staffToken = (user) => {
  return jwt.sign({ data: user.staffId, role: user.role }, secret_key, { expiresIn: "1d" });
};


