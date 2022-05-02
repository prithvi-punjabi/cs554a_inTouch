const express = require("express");
require("dotenv").config();
const app = express();
const configRoutes = require("./routes");
const configMiddlewares = require("./helper/middlewares");
const session = require("express-session");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

const http = require("http").createServer(app);
var io = require("socket.io")(http);
const channelDB = require("./data/channel.js");

//######################SOCKET#######################

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
//######################END OF SOCKET######################
const whitelist = ["http://localhost:3000"];
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin || whitelist.indexOf(origin) !== -1) {
			callback(null, true);
		} else {
			callback(new Error("Not allowed by CORS"));
		}
	},
	credentials: true,
};
app.use(cors(corsOptions));

app.use(
	session({
		name: "AuthCookie",
		secret: "jfkhsrituygobvsnlcdkcjytlfmasrycsx",
		saveUninitialized: true,
		resave: false,
		maxAge: 24 * 60 * 60 * 1000, //24 hours
		proxy: true,
		sameSite: "none",
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/public", express.static(__dirname + "/public"));

configMiddlewares(app);
configRoutes(app);
http.listen(PORT, (error) => {
	if (!error) console.log("Server is up on port " + PORT);
	else console.log("Error occured, server can't start: ", error);
});
