import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateClient(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token provided in cookies.');
    return res.status(401).json({ message: 'Access Denied. No token provided.' });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Token verification failed:', err);
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    console.log('Authenticated user:', req.user);

    next();
  });
}

export default authenticateClient;
