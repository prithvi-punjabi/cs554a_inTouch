const express = require("express");
require("dotenv").config();
const app = express();
const configRoutes = require("./routes");
const configMiddlewares = require("./helper/middlewares");
const session = require("express-session");
const cors = require("cors");

const PORT = process.env.PORT || 4000;

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
app.listen(PORT, (error) => {
  if (!error) console.log("Server is up on port " + PORT);
  else console.log("Error occured, server can't start: ", error);
});
