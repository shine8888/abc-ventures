import { IFund } from '../constants/Fund.constants';
import { TRANSACTION_TYPE } from '../constants/Transactions.constants';

export const generateTradeHistories = (
  updatedRecipientFund: IFund,
  updatedSendingFund: IFund,
  amount: Number
) => {
  return [
    {
      customerId: updatedRecipientFund._id,
      startingBalance:
        Number(updatedRecipientFund.investmentBalance) - Number(amount),
      endingBalance: Number(updatedRecipientFund.investmentBalance),
      transactionAmount: Number(amount),
      transactionType: TRANSACTION_TYPE.DEPOSIT,
    },
    {
      customerId: updatedSendingFund._id,
      startingBalance:
        Number(updatedSendingFund.investmentBalance) + Number(amount),
      endingBalance: Number(updatedSendingFund.investmentBalance),
      transactionAmount: Number(amount),
      transactionType: TRANSACTION_TYPE.WITHDRAWAL,
    },
  ];
};
