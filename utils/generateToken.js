import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret_key = process.env.SECRET_KEY;

export const clientToken = (user) => {
  return jwt.sign({ email: user.email, role: user.role }, secret_key, { expiresIn: "1d" });
};

export const adminToken = (user) => {
  return jwt.sign({ username: user.username, role: "admin" }, secret_key, { expiresIn: "1d" });
};

export const staffToken = (user) => {
  return jwt.sign({ staffId: user.staffId, role: "staff" }, secret_key, { expiresIn: "1d" });
};
