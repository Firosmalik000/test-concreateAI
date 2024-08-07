const fastify = require('fastify')({ logger: true });
const mongoose = require('mongoose');
require('dotenv').config();

// const auth = require('./middlewares/auth');

// Import my routes
const userRoutes = require('./routes/UserRoutes');
// const projectRoutes = require('./routes/project.routes');
// Connect to my database
mongoose
  .connect(
    'mongodb://root:root123@ac-ufjoenx-shard-00-00.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-01.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-02.wv5qisj.mongodb.net:27017/TestConcreateAI?ssl=true&replicaSet=atlas-xeklsr-shard-0&authSource=admin&retryWrites=true&w=majority'
  )
  .then(() => console.log('Connected to the database'))
  .catch((e) => console.log('Error connecting to database', e));

// start my server
fastify.register(userRoutes);
// fastify.register(projectRoutes, { prefix: '/api/v1/projects' });

// fastify.addHook("preHandler", auth);

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 5000);
    fastify.log.info(`Server is running on port ${fastify.server.address().port}`);
  } catch (error) {}
};

start();

//  'mongodb://root:root123@ac-ufjoenx-shard-00-00.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-01.wv5qisj.mongodb.net:27017,ac-ufjoenx-shard-00-02.wv5qisj.mongodb.net:27017/TestConcreateAI?ssl=true&replicaSet=atlas-xeklsr-shard-0&authSource=admin&retryWrites=true&w=majority'
