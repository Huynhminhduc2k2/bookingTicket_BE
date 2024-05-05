import * as httpStatus from "http-status";

import {
  getTicketById,
  getUserTickets,
  createTicket,
} from "../services/ticket.service";
import catchAsync from "../utils/catchAsync";
import { getUserByPhone } from "../services/user.service";


const getUserTicket = catchAsync(async (req, res) => {
  const user = req.user;
  const tickets = await getUserTickets(user._id);
  res.status(httpStatus.OK).send({ message: "success", tickets });
});

const getTicketInforByID = catchAsync(async (req, res) => {
  const ticketId = req.params.id;

  if (!ticketId) {
    return res
      .status(httpStatus.BAD_REQUEST)
      .send({ message: "ticket id is required" });
  }

  const ticket = await getTicketById(ticketId);
  const user = req.user;

  if (!ticket) {
    return res
      .status(httpStatus.NOT_FOUND)
      .send({ message: "ticket not found" });
  } else {
    if (ticket.user.id.toString() !== user._id.toString()) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }
    else {
      return res.status(httpStatus.OK).send({ message: "success", ticket });
    }
  }
});


const requestTicket = catchAsync(async (req, res) => {
  const { trip, totalPrice, user } = req.body;

  const existedUser = await getUserByPhone(user.phone);

  if (existedUser) {
    user.id = existedUser._id;
  }

  const newTicket = await createTicket({
    trip,
    totalPrice,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  res.status(httpStatus.CREATED).send({ message: "success", ticket: newTicket });
});

export {
  getUserTicket,
  getTicketInforByID,
  requestTicket
};
