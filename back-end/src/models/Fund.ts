import mongoose from 'mongoose';

const Fund = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  minInvestAmount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
  },
  investmentBalance: {
    type: Number,
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'customers',
    index: true,
  },
  isVentureFunds: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model('Funds', Fund);
