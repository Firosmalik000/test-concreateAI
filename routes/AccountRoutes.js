const fastify = require('fastify');
const accountController = require('../controllers/AccountController');

async function routes(fastify, options) {
  //   fastify.post('/accounts/create', accountController.createAccount);
  fastify.get('/accounts', accountController.getAllAccounts);
}

module.exports = routes;
