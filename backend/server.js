const express = require('express');
const cors = require('cors');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  app.use(cors({ 
    origin: '*',
    credentials: true 
}));

  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start();


  server.applyMiddleware({ app, path: '/' });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = { startServer };
