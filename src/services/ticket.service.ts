import Ticket from "../models/booking.model";

const getTicketById = async (id: string) => {
  return await Ticket.findById(id);
};



const getUserTickets = async (userId: string) => {
  return await Ticket.find({ "user.id": userId }).sort({ createdAt: -1 });
};


export {
  getTicketById,
  getUserTickets,
};
