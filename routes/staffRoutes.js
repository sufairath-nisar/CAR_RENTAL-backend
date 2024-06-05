import express from "express";

import {signinStaff} from "../controllers/staffController.js";


const staffRouter = express.Router();

staffRouter.post("/signin-staff", signinStaff);


export default staffRouter;