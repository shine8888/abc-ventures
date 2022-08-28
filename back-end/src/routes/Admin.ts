import express from 'express';
import * as controller from '../controllers/AdminController';

const router = express.Router();

router.route('/customer-portfolios').get(controller.getCustomerPortfolios);
router.route('/trading-histories').get(controller.getTradingHistories);
router.route('/list-funds').get(controller.getListFunds);
router.route('/list-funds').put(controller.updateListFunds);
router.route('/fund-allocations').post(controller.allocateBalancesBetweenFunds);

export default router;
