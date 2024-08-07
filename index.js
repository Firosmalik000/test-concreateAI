const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/UserRoutes');
const accountRoutes = require('./routes/AccountRoutes');
const fastifyCors = require('@fastify/cors');
const fastifyJwt = require('@fastify/jwt');
const fastifyCookie = require('@fastify/cookie');
const fastifySession = require('@fastify/session');

// Koneksi ke MongoDB
mongoose
  .connect(
    'mongodb://root:root123@ac-ufjoenx-shard-00-00.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-01.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-02.wv5qisj.mongodb.net:27017/TestConcreateAI?ssl=true&replicaSet=atlas-xeklsr-shard-0&authSource=admin&retryWrites=true&w=majority'
  )
  .then(() => console.log('Connected to the database'))
  .catch((e) => console.log('Error connecting to database', e));

// Register middleware dan plugin
fastify.register(fastifyCors, { origin: '*' });
fastify.register(fastifyJwt, { secret: 'superSecret' });
fastify.register(fastifyCookie);

// Dekorasi authenticate untuk penggunaan JWT
fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

// Register routes
fastify.register(userRoutes);
fastify.register(accountRoutes);

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 5000, host: '0.0.0.0' });
    fastify.log.info(`Server is running on port ${fastify.server.address().port}`);
  } catch (error) {
    fastify.log.error('Error starting server:', error);
    process.exit(1);
  }
};

start();
