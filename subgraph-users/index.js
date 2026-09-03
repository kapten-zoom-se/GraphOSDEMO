const { readFileSync } = require('fs');
const path = require('path');
const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const resolvers = require('./resolvers');

const typeDefs = gql(
  readFileSync(path.join(__dirname, 'schema.graphql'), 'utf-8')
);

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

const PORT = process.env.PORT || 4002;

startStandaloneServer(server, {
  listen: { port: Number(PORT) },
}).then(({ url }) => {
  console.log(`👤 Users subgraph ready at ${url}`);
});
