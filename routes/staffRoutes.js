import express from "express";

import {signin,
        signupstaff
} from "../controllers/staffController.js";


const staffRouter = express.Router();

staffRouter.post("/signupstaff", signupstaff);
staffRouter.post("/signin", signin);


export default staffRouter;