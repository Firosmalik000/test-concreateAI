const User = require('../models/UserModel');
const bcrypt = require('bcrypt');

// // controllers/userController.js
// exports.register = async (req, reply) => {
//   const { email, password } = req.body;
//   console.log('Request Body:', req.body);
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ email, password: hashedPassword });
//     await user.save();
//     reply.send(user);
//   } catch (error) {
//     reply.code(400).send({ error: 'Email already exists' });
//   }
// };

// exports.login = async (req, reply) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return reply.status(401).send({ message: 'Invalid email or password' });
//     }

//     const isMatch = await bcrypt.compare(req.body.password, user.password);
//     if (!isMatch) {
//       return reply.status(401).send({ message: 'Invalid email or password' });
//     }
//     const token = jwt.sign({ userId: user._id }, 'secretkey', {
//       expiresIn: '1h',
//     });

//     reply.send({ message: 'Login successful', user, token });
//   } catch (error) {
//     reply.status(500).send({ message: error.message });
//   }
// };

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

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  deleteUser,
};
