import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function authenticateStaff(req, res, next) {
  const token = req.cookies.token;

  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;
    console.log(req.user.staffId);

    next();
  });
}

export default authenticateStaff;