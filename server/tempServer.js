const express = require("express");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const _ = require("lodash");
const checkUserLogin = require("./data").userData.checkLoggedInUser;
const userDefs = require("./defs/userDefs");
const postDefs = require("./defs/postDefs");

//Changed Channel Def source
const channelDefs = require("./tempChannelDefs");
//

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

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

const loginRequiredOperations = [
  "GetUser",
  "AddFriend",
  "DeleteFriend",
  "CreateUser",
  "GetPostById",
  "GetAllPost",
  "GetPostByQuery",
  "GetPostsForUser",
  "CreatePost",
  "UpdatePost",
  "LikePost",
  "UnlikePost",
  "AddComment",
  "RemovePost",
  "DeleteComment",
  "GetChannelsForUser",
  "GetChannelById",
  "GetAllChannels",
  "CreateChannel",
  "UpdateChannel",
  "RemovePost",
  "AddMessage",
  "DeleteMessage",
];

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    let user;
    const { variables } = req.body || { variables: {} };
    if (loginRequiredOperations.includes(req.body.operationName)) {
      user = await checkUserLogin(token);
      if (!user) {
        throw new AuthenticationError("Invalid authorization token");
      }
    }
    switch (req.body.operationName) {
      case "GetPostsForUser":
        break;
      case "GetUser":
        break;
      default:
        break;
    }
    return { user };
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
