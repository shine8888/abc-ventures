import mongoose from 'mongoose';

const Customer = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  accountWalletAmount: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model('Customers', Customer);
