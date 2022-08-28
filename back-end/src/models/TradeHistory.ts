import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const TradeHistory = new Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      required: true,
      index: true,
      ref: 'Customers',
    },
    startingBalance: {
      type: Number,
      required: true,
    },
    endingBalance: {
      type: Number,
      required: true,
    },
    transactionAmount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      index: true,
    },
    transactionDate: {
      type: Date,
      default: new Date(),
    },
  },
  { timestamps: false }
);

export default mongoose.model('TradeHistory', TradeHistory);
