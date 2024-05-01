import { publicLog, publicSearchTrip } from "../../controllers/anonymous.controller";
import express from "express";
const publicRoute = express.Router();

publicRoute.get("/", publicLog);
publicRoute.post("/findTrip", publicSearchTrip);

export default publicRoute;
