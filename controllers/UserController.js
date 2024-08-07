const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Account = require('../models/AccountModel');

async function getAllUsers(req, reply) {
  try {
    const users = await User.find().populate('accountType');
    console.log(users); // Cek output di console
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function getUserById(req, reply) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }
    reply.send(user);
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function createUser(req, reply) {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    const result = await user.save();
    reply.status(201).send(result);
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function deleteUser(req, reply) {
  try {
    await User.findByIdAndDelete(req.params.id);
    reply.status(204).send({ message: 'User deleted successfully' });
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function updateUser(req, reply) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return reply.status(401).send({ message: 'Please login first' });
    }

    const decoded = jwt.verify(token, 'secretkey');
    const userId = decoded.userId;

    const payload = req.body;
    const updateData = {};

    if (payload.name) updateData.name = payload.name;

    if (payload.accountType) {
      const validAccounts = await Account.find({ _id: { $in: payload.accountType } });
      if (validAccounts.length !== payload.accountType.length) {
        return reply.status(400).send({ message: 'Some account types are invalid' });
      }
      updateData.accountType = payload.accountType;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
    if (!updatedUser) {
      return reply.status(404).send({ message: 'User not found' });
    }

    reply.send(updatedUser);
  } catch (err) {
    console.error(err);
    reply.status(500).send({ message: 'Error updating user' });
  }
}

async function Login(req, reply) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return reply.status(401).send({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id, user: user }, 'secretkey', {
      expiresIn: '1h',
    });
    reply.cookie('token', token, { httpOnly: true }).send({ message: 'Login successful', user, token });
  } catch (err) {
    reply.status(500).send(err);
  }
}

async function Me(req, reply) {
  try {
    const token = req.cookies.token;
    if (!token) {
      return reply.status(401).send({ message: 'Please login first' });
    }
    const decoded = jwt.verify(token, 'secretkey');
    const user = await User.findById(decoded.userId);
    if (!user) {
      return reply.status(404).send({ message: 'User not found' });
    }

    reply.send({ token, user });
  } catch (err) {
    console.log(err);
    reply.status(401).send({ message: 'Unauthorized' });
  }
}

async function Logout(req, reply) {
  reply.clearCookie('token').send({ message: 'Logout successful' });
}

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
  Login,
  Me,
  Logout,
  updateUser,
};
