require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const cors = require('@fastify/cors');
const mongoose = require('mongoose');

fastify.register(cors, {
  origin: '*',
});

mongoose
  .connect(
    'mongodb://root:root123@ac-ufjoenx-shard-00-00.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-01.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-02.wv5qisj.mongodb.net:27017/TestConcreateAI?ssl=true&replicaSet=atlas-xeklsr-shard-0&authSource=admin&retryWrites=true&w=majority'
  )
  .then(() => {
    fastify.log.info('MongoDB Connected');
    start();
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

// Start server
const start = async () => {
  try {
    await fastify.listen({ port: 5000 });
    fastify.log.info(`Server listening on port 5000`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
