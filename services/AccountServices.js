const Account = require('../models/AccountModel');
const Transaction = require('../models/TransactionModel');

exports.createAccount = async (userId, type) => {
  try {
    const account = new Account({ userId, type });
    return await account.save();
  } catch (error) {
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

exports.addTransaction = async (accountId, amount, type) => {
  try {
    const account = await Account.findById(accountId);
    if (!account) throw new Error('Account not found');

    // Update balance
    if (type === 'deposit') {
      account.balance += amount;
    } else if (type === 'withdrawal') {
      if (account.balance < amount) throw new Error('Insufficient funds');
      account.balance -= amount;
    }

    const transaction = new Transaction({
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
