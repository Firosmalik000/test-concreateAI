const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

async function getAllUsers(req, reply) {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (error) {
    reply.send(error);
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
};
