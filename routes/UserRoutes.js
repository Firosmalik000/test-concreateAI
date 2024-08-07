const fastify = require('fastify');
const userController = require('../controllers/UserController');

async function routes(fastify, options) {
  fastify.get('/users', userController.getAllUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.post('/register', userController.createUser);
  fastify.post('/login', userController.Login);
  fastify.get('/me', userController.Me);
  fastify.delete('/users/:id', userController.deleteUser);
  fastify.delete('/logout', userController.Logout);
  fastify.put('/users/update', userController.updateUser);
}

module.exports = routes;
