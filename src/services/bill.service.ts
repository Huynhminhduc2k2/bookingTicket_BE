import Bill, {IBill} from "../models/bill.model";

const saveBill = async (payload: IBill) => {
  const response = await Bill.create([payload]);
  return response[0];
};

const getBillById = async (id: string) => {
  return await Bill.findById(id);
};

const updateBillInforById = async (id: string, payload: IBill) => {
  return await Bill.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deleteBillbyId = async (id: string) => {
  return await Bill.deleteOne({ _id: id });
};

const getUserBills = async (userId: string) => {
  return await Bill.find({ "booking.userId": userId }).sort({ createdAt: -1 });
};


export {
  saveBill,
  getBillById,
  updateBillInforById,
  deleteBillbyId,
  getUserBills,
};
