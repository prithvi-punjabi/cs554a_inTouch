const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const _ = require("lodash");
const userDefs = require("./userDefs");
const postDefs = require("./postDefs");

const session = require("express-session");

const typeDefs = [userDefs.typeDefs, postDefs.typeDefs];
const resolvers = _.merge(userDefs.userResolvers, postDefs.postResolvers);

async function startApolloServer(typeDefs, resolvers) {
  const server = new ApolloServer({ typeDefs, resolvers });
  const app = express();
  await server.start();
  server.applyMiddleware({ app, path: "/graphql" });
  app.use(
    session({
      name: "AuthCookie",
      secret: "some secret string!",
      resave: false,
      saveUninitialized: true,
    })
  );
  app.listen(4000, () => {
    console.log(
      `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startApolloServer(typeDefs, resolvers);
