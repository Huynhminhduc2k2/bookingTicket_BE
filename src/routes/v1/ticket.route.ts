import express from "express";
import {
  getUserTicket,
  getTicketInforByID,
  requestTicket
} from "../../controllers/ticket.controller";
import auth from "../../middlewares/auth";

const ticketRoute = express.Router();

ticketRoute.get("/",
  auth("ticket"),
  getUserTicket
);

ticketRoute.get("/:id",
  auth("ticket"),
  getTicketInforByID
);

ticketRoute.post("/request",
  auth("ticket"),
  requestTicket
);



export default ticketRoute;
