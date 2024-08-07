const Account = require('../models/AccountModel');
const Transaction = require('../models/TransactionModel');

exports.createAccount = async ({ type, userId }) => {
  try {
    if (!type || !userId) {
      throw new Error('Invalid input');
    }

    const account = new Account({ type });
    account.userId = userId;

    return await account.save();
  } catch (error) {
    console.error('Error creating account:', error);
    throw new Error('Error creating account');
  }
};

exports.getAccountsByUserId = async (userId) => {
  try {
    return await Account.find({ userId }).populate('transactions');
  } catch (error) {
    throw new Error('Error fetching accounts');
  }
};

exports.addTransaction = async (req, reply) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return reply.status(401).send({ message: 'Please login first' });
    }

    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.userId;
    const { accountId, amount, type } = req.body;

    const account = await Account.findById(accountId);
    if (!account) {
      throw new Error('Account not found');
    }

    // Update balance
    if (type === 'deposit') {
      account.balance += amount;
    } else if (type === 'withdrawal') {
      if (account.balance < amount) {
        throw new Error('Insufficient funds');
      }
      account.balance -= amount;
    } else {
      throw new Error('Invalid transaction type');
    }

    const transaction = new Transaction({
      userId,
      accountId,
      amount,
      type,
    });

    await transaction.save();
    account.transactions.push(transaction);
    await account.save();

    return { account, transaction };
  } catch (error) {
    throw new Error('Error processing transaction');
  }
};
