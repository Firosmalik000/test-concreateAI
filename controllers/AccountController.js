const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllAccounts(req, reply) {
  try {
    const accounts = await prisma.account.findMany({
      include: {
        user: true,
        transactions: {
          include: {
            user: true,
          },
        },
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

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  const userId = decoded.userId;
  try {
    const { type } = req.body;

    const account = await prisma.account.create({
      data: {
        type,
        user: { connect: { id: userId } },
      },
    });

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

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
  const userId = decoded.userId;
  const { accountId, amount, type } = req.body;

  try {
    // Validate input
    if (!accountId || !amount || !type) {
      return reply.status(400).send({ message: 'Missing required fields' });
    }

    // Find the account
    const account = await prisma.account.findUnique({
      where: { id: accountId },
    });

    if (!account || account.userId !== userId) {
      return reply.status(404).send({ message: 'Account not found or does not belong to the user' });
    }

    // Check transaction type and update balance
    let newBalance = account.balance;
    if (type === 'deposit') {
      newBalance += amount;
    } else if (type === 'withdrawal') {
      if (newBalance < amount) {
        return reply.status(400).send({ message: 'Insufficient funds' });
      }
      newBalance -= amount;
    } else {
      return reply.status(400).send({ message: 'Invalid transaction type' });
    }

    // Create the transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        accountId,
        amount,
        type,
      },
    });

    // Update the account balance
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: newBalance,
        transactions: {
          connect: { id: transaction.id },
        },
      },
    });

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
