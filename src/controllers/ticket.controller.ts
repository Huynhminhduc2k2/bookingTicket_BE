import * as httpStatus from "http-status";

import {
  getTicketById,
  getUserTickets,
} from "../services/ticket.service";
import catchAsync from "../utils/catchAsync";


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
            return res.status(httpStatus.OK).send({ message: "success", ticket });
}
});
    
export {
  getUserTicket,
  getTicketInforByID
};
