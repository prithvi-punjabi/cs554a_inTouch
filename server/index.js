//*****PUTTING ALL THINGS INSIDE ASYNC MIGHT****
//*****BE BEST PRACTICE,TRY IT IF SOMETHING*****
//*****IS NOT WORKING***************************
//*********SCROLL ALL THE WAY DOWN**************
//ORIGINAL DEPENDENCIES
const express = require("express");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const _ = require("lodash");
const checkUserLogin = require("./data").userData.checkLoggedInUser;
const userDefs = require("./defs/userDefs");
const postDefs = require("./defs/postDefs");
const channelDefs = require("./defs/channelDefs");

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/.env") });

//SOCKET DEPENDENCIES
const { createServer } = require("http");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

//Express and Http
const app = express();
const httpServer = createServer(app);

const typeDefs = [userDefs.typeDefs, postDefs.typeDefs, channelDefs.typeDefs];
const resolvers = _.merge(
  userDefs.userResolvers,
  postDefs.postResolvers,
  channelDefs.channelResolvers
);

const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

//Combining Schema (Required for running with Socket)
const schema = makeExecutableSchema({ typeDefs, resolvers });

//WEBSOCKET SERVER
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if your ApolloServer serves at
  // a different path.
  path: "/subscriptions",
});

const serverCleanup = useServer(
  {
    schema,
    onConnect: async (ctx) => {
      console.log("New client connected");
      // console.log(ctx);
      //   // Check authentication every time a client connects.
      //   if (tokenIsNotValid(ctx.connectionParams)) {
      //     // You can return false to close the connection  or throw an explicit error
      //     throw new Error("Auth token missing!");
      //   }
    },
  },
  wsServer
);

const loginRequiredOperations = [
  "GetUser",
  "GetFriendRecommendations",
  "AddFriend",
  "DeleteFriend",
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
  "UpdateMessageRead",
  "GetFriends",
  "GetByQuery",
];

//Creating Server Instance with Socket enabling Config
const server = new ApolloServer({
  schema,
  //Step 6 actually
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
  context: async ({ req }) => {
    const token = req.headers.authorization || "";
    let user;
    const { variables } = req.body || { variables: {} };
    if (loginRequiredOperations.includes(req.body.operationName)) {
      if (!token || token == "") {
        throw new AuthenticationError("Must provide authorization token");
      }
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
    return { user, pubsub };
  },
});

//TRYING TO PUT PUBSUB IN CONTEXT
// const getDynamicContext = async ({ pubsub }, msg, args) => {
//   // ctx is the graphql-ws Context where connectionParams live
//   //   if (ctx.connectionParams.authentication) {
//   //     const currentUser = await findUser(connectionParams.authentication);
//   //     return { currentUser };
//   //   }
//   // Otherwise let our resolvers know we don't have a current user
//   return { pubsub };
// };

// useServer(
//   {
//     schema,
//     context: (ctx, msg, args) => {
//       // You can define your own function for setting a dynamic context
//       // or provide a static value
//       return getDynamicContext({ pubsub }, msg, args);
//     },
//   },
//   wsServer
// );
//ASYNC FUNCTION BLOCK FOR AWAITING SERVER START
//*****PUTTING ALL THINGS INSIDE ASYNC MIGHT****
//*****BE BEST PRACTICE,TRY IT IF SOMETHING*****
//*****IS NOT WORKING***************************
(async function () {
  await server.start();
  //Might require path: "/graphql" for applyMiddleware
  server.applyMiddleware({ app });
  //Step 7
  httpServer.listen({ port: 4000 }, () =>
    console.log(
      `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
    )
  );
})();
