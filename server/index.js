const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const _ = require("lodash");
const checkUserLogin = require("./data").userData.checkLoggedInUser;
const userDefs = require("./defs/userDefs");
const postDefs = require("./defs/postDefs");
const channelDefs = require("./defs/channelDefs");

const session = require("express-session");

const typeDefs = [userDefs.typeDefs, postDefs.typeDefs, channelDefs.typeDefs];
const resolvers = _.merge(
  userDefs.userResolvers,
  postDefs.postResolvers,
  channelDefs.channelResolvers
);

const app = express();
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: true,
    saveUninitialized: true,
    rolling: true,
  })
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    // // get the user token from the headers
    // const token = req.headers.authorization || "";
    // // try to retrieve a user with the token
    // const user = checkUserLogin(token);
    // // optionally block the user
    // // we could also check user roles/permissions here
    // if (!user) throw new AuthenticationError("you must be logged in");
    // // add the user to the context
    // return user;
  },
});

server.start().then((res) => {
  server.applyMiddleware({ app, path: "/graphql" });
  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
    )
  );
});
