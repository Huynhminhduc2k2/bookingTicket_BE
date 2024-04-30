import express from "express";
import {
  getUserTicket,
  getTicketInforByID,
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



export default ticketRoute;
