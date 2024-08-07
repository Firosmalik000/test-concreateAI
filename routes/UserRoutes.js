const fastify = require('fastify');
const userController = require('../controllers/UserController');

async function routes(fastify, options) {
  fastify.get('/users', userController.getAllUsers);
  fastify.get('/users/:id', userController.getUserById);
  fastify.post('/register', userController.createUser);
  fastify.delete('/users/:id', userController.deleteUser);
}

module.exports = routes;
