import Like from "../models/like.model";
import Bill, {IBill} from "../models/bill.model";

const saveBill = async (payload: IBill) => {
  const response = await Bill.create([payload]);
  return response[0];
};

const saveMultipleTweets = async (payload: IBill[]) => {
  return await Bill.insertMany(payload);
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

const likeTweet = async (tweet: string, user: string) => {
  return await Like.create({
    tweet,
    user,
  });
};

const unlikeTweet = async (tweet: string) => {
  return await Like.deleteOne({
    tweet,
  });
};

export {
  saveBill,
  saveMultipleTweets,
  getBillById,
  updateBillInforById,
  deleteBillbyId,
  getUserBills,
  likeTweet,
  unlikeTweet,
};
