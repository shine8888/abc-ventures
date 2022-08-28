import mongoose from '../db/connect';

export interface IFund {
  _id: mongoose.Types.ObjectId;
  investmentBalance: Number;
  name: String;
  minInvestAmount: Number;
  description: String;
  customerId?: mongoose.Types.ObjectId;
  isVentureFunds?: Boolean;
}
