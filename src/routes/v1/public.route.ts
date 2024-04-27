import { publicLog } from "../../controllers/anonymous.controller";
import express from "express";
const publicRoute = express.Router();

publicRoute.get("/", publicLog);

export default publicRoute;
