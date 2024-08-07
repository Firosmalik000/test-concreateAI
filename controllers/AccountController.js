const jwt = require('jsonwebtoken');
const Account = require('../models/AccountModel');
const User = require('../models/UserModel');
const AccountService = require('../services/AccountServices');

async function getAllAccounts(req, reply) {
  try {
    const accounts = await Account.find();
    reply.send(accounts);
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function createAccount(req, reply) {
  try {
    const { type } = req.body;

    const account = await AccountService.createAccount({ type });

    reply.status(201).send(account);
  } catch (err) {
    console.error(err);
    reply.status(500).send(err);
  }
}

module.exports = {
  getAllAccounts,
  createAccount,
};
