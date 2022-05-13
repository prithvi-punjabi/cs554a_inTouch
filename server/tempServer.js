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

//------------------------SOCKET--------------------------------
const http = require("http").createServer(app)
var io = require("socket.io")(http);
//temp
const { ObjectId } = require("mongodb");
// const common = require("./helper/common");
// let user = {
// 	_id: ObjectId(),
// 	userName: "Nevil",
// 	profilePicture: "https://www.w3schools.com/howto/img_avatar.png",
// 	designation: common.designation.ADMIN,
// };
//

io.on("connection", (socket) => {
	console.log("new client connected", socket.id);

	// socket.on('user_join'+channelId, (name) => {
	//   socket.broadcast.emit('user_join', name);
	// });


	socket.on("message", async ({ channelId, user, message }) => {
		user._id = ObjectId(user._id);
		// console.log(channelId, message);
		const createdMessage = await channelDB.addMessage(channelId, user, message);
		// console.log(createdMessage);
		// console.log(roomId, name, message, socket.id);
		// console.log(message);
		// console.log(channelId);
		// console.log(user);
		createdMessage["channelId"] = channelId;
		io.emit("message", createdMessage);
	});

	socket.on("disconnect", () => {
		console.log("Disconnect Fired");
	});
});
//____________________END OF SOCKET______________________________

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
    return { user };
  },
});

  // http.listen({ port: 4000 }, () =>
  // console.log(
  //   `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
  // )
  // );
server.start().then((res) => {
  server.applyMiddleware({ app, path: "/graphql" });
  app.listen({ port: 4000 }, () =>
    console.log(
      `🚀  Server ready at http://localhost:4000${server.graphqlPath}`
    )
  );
});
