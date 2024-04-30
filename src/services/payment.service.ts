import Payment, {IPayment} from "../models/payment.model";

const savePayment = async (payload: IPayment) => {
  const response = await Payment.create([payload]);
  return response[0];
};

const getPaymentById = async (id: string) => {
  return await Payment.findById(id);
};

const updatePaymentInforById = async (id: string, payload: IPayment) => {
  return await Payment.findOneAndUpdate({ _id: id }, payload, { new: true });
};

const deletePaymentbyId = async (id: string) => {
  return await Payment.deleteOne({ _id: id });
};

const getUserPayments = async (userId: string) => {
  return await Payment.find({ "user.id": userId }).sort({ createdAt: -1 });
};


export {
  savePayment,
  getPaymentById,
  updatePaymentInforById,
  deletePaymentbyId,
  getUserPayments,
};
