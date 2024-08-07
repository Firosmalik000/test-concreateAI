const jwt = require('jsonwebtoken');
const Account = require('../models/AccountModel');
const User = require('../models/UserModel');
const AccountService = require('../services/AccountServices');
const Transaction = require('../models/TransactionModel');

async function getAllAccounts(req, reply) {
  try {
    const accounts = await Account.find()
      .populate('userId')
      .populate({
        path: 'transactions',
        populate: {
          path: 'userId',
          model: 'User',
        },
      });
    reply.send(accounts);
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function createAccount(req, reply) {
  const token = req.cookies.token;
  if (!token) {
    return reply.status(401).send({ message: 'Please login first' });
  }

  const decoded = jwt.verify(token, 'secretkey');
  const userId = decoded.userId;
  try {
    const { type } = req.body;

    const account = await AccountService.createAccount({ type, userId });
    if (account) {
      await User.updateOne({ _id: userId }, { $push: { accountType: account._id } });
    }
    reply.status(201).send(account);
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
}

const addTransaction = async (req, reply) => {
  const token = req.cookies.token;
  if (!token) {
    return reply.status(401).send({ message: 'Please login first' });
  }

  const decoded = jwt.verify(token, 'secretkey');
  const userId = decoded.userId;
  const { accountId, amount, type } = req.body;

  try {
    // Validate input
    if (!accountId || !amount || !type) {
      return reply.status(400).send({ message: 'Missing required fields' });
    }

    // Find the account
    const account = await Account.findOne({ _id: accountId, userId: userId });
    if (!account) return reply.status(404).send({ message: 'Account not found or does not belong to the user' });

    // Check transaction type and update balance
    if (type === 'deposit') {
      account.balance += amount;
    } else if (type === 'withdrawal') {
      if (account.balance < amount) return reply.status(400).send({ message: 'Insufficient funds' });
      account.balance -= amount;
    } else {
      return reply.status(400).send({ message: 'Invalid transaction type' });
    }

    // Save the transaction
    const transaction = new Transaction({
      userId: userId,
      accountId,
      amount,
      type,
    });

    await transaction.save();

    // Update account with new transaction
    account.transactions.push(transaction._id);
    await account.save();

    reply.status(201).send({ message: 'Transaction successfully added', data: transaction });
  } catch (error) {
    reply.status(500).send({ message: error.message });
  }
};

module.exports = {
  getAllAccounts,
  createAccount,
  addTransaction,
};
