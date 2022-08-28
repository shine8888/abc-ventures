import mongoose from 'mongoose';

const CustomerInvestment = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    fundId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('CustomerInvestment', CustomerInvestment);
