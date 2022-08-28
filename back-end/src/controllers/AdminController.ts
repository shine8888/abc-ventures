import { Request, Response, NextFunction } from 'express';
import { isEmpty } from 'lodash';
import { errorHandler, successHandler } from '../middlewares/statusHandler';
import Customer from '../models/Customer';
import Fund from '../models/Fund';
import TradeHistory from '../models/TradeHistory';
import mongooseConnection from '../db/connect';
import { generateTradeHistories } from '../utils/generateTradeHistory';
import { IFund } from '../constants/Fund.constants';
import { getDeletingFundIds } from '../utils/getDeletingFundIds';

/**
 * Get all trade histories
 *
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<void>}
 */
export const getTradingHistories = async (
  req: Request,
  res: Response
): Promise<void> => {
  // Get all trade histories
  const histories = await TradeHistory.find({}).lean();

  successHandler(res, 200, histories);
};

/**
 * Get customer portfolio
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getCustomerPortfolios = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Query to get all the funds that customer invested
  const customerPortfolios = await Customer.aggregate([
    {
      $lookup: {
        from: 'funds',
        let: { id: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ['$customerId', '$$id'],
              },
            },
          },
          {
            $project: {
              name: 1,
              investmentBalance: 1,
              _id: 0,
            },
          },
        ],
        as: 'funds',
      },
    },
  ]);

  successHandler(res, 200, customerPortfolios);
};

/**
 * Get the list funds of ABC Ventures
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 *
 */
export const getListFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Get all the funds of ABC Ventures
  const result = await Fund.find({ isVentureFunds: true }).lean();

  successHandler(res, 200, result);
};

/**
 * Update the list funds: add new fund, remove fund,...
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 *
 */
export const updateListFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Start the session
  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    let result;
    const { listFunds } = req.body;

    // Get the funds belong to ABC Ventures
    const funds = await Fund.find({ isVentureFunds: true }).lean();

    // Check the remove fund list
    const listFundIds = listFunds.map((f: any) => f._id);
    const fundIds = funds.map((f) => f._id as unknown as string);
    const deleteIds = getDeletingFundIds(listFundIds, fundIds);

    // Insert when funds collection is empty
    if (isEmpty(funds) && !isEmpty(listFunds)) {
      result = await Fund.insertMany(listFunds, { session });
      await session.commitTransaction();

      return successHandler(res, 200, result);
    }

    // Remove the uneeded funds
    if (!isEmpty(deleteIds)) {
      await Fund.deleteMany(
        {
          _id: { $in: deleteIds },
        },
        { session }
      );
    }

    // Update values for other funds
    result = await Fund.bulkWrite(
      listFunds
        .map((e: any) => {
          if (e._id) return e;
          return { ...e, _id: new mongooseConnection.Types.ObjectId() };
        })
        .map((f: any) => ({
          updateOne: {
            filter: { _id: f?._id },
            update: f,
            upsert: true,
          },
        })),
      { session, checkKeys: false }
    );

    // Commit session
    await session.commitTransaction();

    return successHandler(res, 200, result);
  } catch (error) {
    errorHandler({ message: 'An error occurs when update list funds' }, res);
  } finally {
    session.endSession();
  }
};

/**
 * Allocate the balances between funds
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const allocateBalancesBetweenFunds = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Start the session
  const session = await mongooseConnection.startSession();
  session.startTransaction();

  try {
    // Get all parameters: sendingFundAddress, recipientFundAddress, amount
    const { sendingFundAddress, recipientFundAddress, amount } = req.body;
    // Find the sending fund and recipient fund
    const sendingFund: IFund = await Fund.findOne({
      _id: sendingFundAddress,
    }).lean();
    const recipientFund = await Fund.findOne({
      _id: recipientFundAddress,
    }).lean();

    if (!sendingFund || !recipientFund) {
      await session.commitTransaction();
      return errorHandler(
        { message: 'Sending funds or recipient funds not found' },
        res
      );
    }

    // Check if sendingFund amount is more than current amount
    if (sendingFund.investmentBalance < amount) {
      await session.commitTransaction();
      return errorHandler(
        { message: 'Your sending amount is higher than current balance' },
        res
      );
    }

    // Update the amount for sending fund and recipient fund
    const updatedSendingFund: IFund | null = await Fund.findOneAndUpdate(
      { _id: sendingFundAddress },
      {
        $set: {
          investmentBalance:
            Number(sendingFund.investmentBalance) - Number(amount),
        },
      },
      {
        session,
        new: true,
      }
    );

    const updatedRecipientFund: IFund | null = await Fund.findOneAndUpdate(
      { _id: recipientFundAddress },
      {
        $set: {
          investmentBalance:
            Number(recipientFund.investmentBalance) + Number(amount),
        },
      },
      {
        session,
        new: true,
      }
    );

    // Get the list trade histories
    const listTradeHistories = generateTradeHistories(
      updatedRecipientFund as IFund,
      updatedSendingFund as IFund,
      amount
    );

    // Adding trade histories to database
    const result = await TradeHistory.insertMany(listTradeHistories, {
      session,
    });

    // Commit session
    await session.commitTransaction();

    successHandler(res, 200, result);
  } catch (error) {
    errorHandler(
      { message: 'An error occurs when allocate fund balance' },
      res
    );
  } finally {
    session.endSession();
  }
};
