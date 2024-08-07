const Account = require('../models/AccountModel');
const AccountService = require('../services/AccountServices');

async function getAllAccounts(req, reply) {
  try {
    const accounts = await Account.find();
    reply.send(accounts);
  } catch (err) {
    reply.status(500).send(err);
  }
}

// async function createAccount(req, reply) {
//   const { userId } = req.user.userId;
//   const { type } = req.body;
//   try {
//     const account = AccountService.createAccount({ userId, type });
//     reply.status(201).send(account);
//   } catch (err) {
//     reply.status(500).send(err);
//   }
// }

// async function getAccountsByUserId(userId) {
//   const { userId } = req.params;
//   try {
//     const accounts = await accountService.getAccountsByUserId(userId);
//     reply.send(accounts);
//   } catch (error) {
//     reply.code(400).send({ error: error.message });
//   }
// }

// async function addTransaction(req, reply) {
//   const { accountId, amount, type } = req.body;
//   try {
//     const result = await accountService.addTransaction(accountId, amount, type);
//     reply.send(result);
//   } catch (error) {
//     reply.code(400).send({ error: error.message });
//   }
// }

module.exports = {
  getAllAccounts,
  //   createAccount,
  //   addTransaction,
  //   getAccountsByUserId,
};
