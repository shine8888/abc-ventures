import axios from 'axios';
import { ADMIN_URL } from '../constants/services.constants';

const getUserTradingHistory = async (userId) => {
  const result = await axios.get(`/admin/${userId}`);
  return result.data;
};

const getTradingHistory = async () => {
  const result = await axios.get(`${ADMIN_URL}/trading-histories`);

  return result.data;
};

const getCustomerInvestmentDetails = async () => {
  const result = await axios.get(`${ADMIN_URL}/customer-portfolios`);

  return result.data;
};

const getListFunds = async () => {
  const result = await axios.get(`${ADMIN_URL}/list-funds`);

  return result.data;
};

const updateListFunds = async ({ listFunds }) => {
  const result = await axios.put(`${ADMIN_URL}/list-funds`, {
    listFunds,
  });

  return result.data;
};

const getListUsers = async () => {
  const result = await axios.get(`${ADMIN_URL}/customer-list`);

  return result.data;
};

const allocateBalancesBetweenFunds = async ({
  sendingFundAddress,
  recipientFundAddress,
  amount,
}) => {
  const result = await axios.post(`${ADMIN_URL}/fund-allocations`, {
    sendingFundAddress,
    recipientFundAddress,
    amount,
  });

  return result.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUserTradingHistory,
  getTradingHistory,
  getCustomerInvestmentDetails,
  getListFunds,
  updateListFunds,
  getListUsers,
  allocateBalancesBetweenFunds,
};
