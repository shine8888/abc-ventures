import mongoose from '../db/connect';

export interface ITradeHistory {
  _id: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  startingBalance: Number;
  endingBalance: Number;
  transactionAmount: Number;
  transactionType: String;
  transactionDate?: Date;
}
