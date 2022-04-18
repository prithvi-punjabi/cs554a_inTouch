const { ObjectId } = require("mongodb");
const xss = require("xss");
const { errorCode } = require("./common");
const { ErrorMessage } = require("./message");
const utils = require("./utils");

module.exports = async (app) => {
  app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    if (utils.isUserLoggedIn(req)) {
      req.session.user._id = ObjectId(req.session.user._id);
      req.session.user.friends = req.session.user.friends.map((userid) =>
        ObjectId(userid)
      );
    }
    next();
  });

  app.use("/posts", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res
        .status(errorCode.FORBIDDEN)
        .json(ErrorMessage("Login to access posts"));
    }
    next();
  });

  app.use("/channels", (req, res, next) => {
    if (!utils.isUserLoggedIn(req)) {
      return res
        .status(errorCode.FORBIDDEN)
        .json(ErrorMessage("Login to access channels"));
    }
    next();
  });

  app.use("/channels/add", (req, res, next) => {
    if (!utils.isAdmin(req)) {
      return res
        .status(errorCode.UNAUTHORIZED)
        .json(ErrorMessage("You need admin access to add channel"));
    }
    next();
  });

  app.use("/channels/update", (req, res, next) => {
    if (!utils.isAdmin(req)) {
      return res
        .status(errorCode.UNAUTHORIZED)
        .json(ErrorMessage("You need admin access to update channel"));
    }
    next();
  });

  app.use("/channels/delete", (req, res, next) => {
    if (!utils.isAdmin(req)) {
      return res
        .status(errorCode.UNAUTHORIZED)
        .json(ErrorMessage("You need admin access to delete channel"));
    }
    next();
  });

  app.use("/channels/all", (req, res, next) => {
    if (!utils.isAdmin(req)) {
      return res
        .status(errorCode.UNAUTHORIZED)
        .json(ErrorMessage("You need admin access to fetch all channels"));
    }
    next();
  });

  app.use((req, res, next) => {
    for (const key in req.body) {
      if (Object.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] == "string")
          req.body[key] = xss(req.body[key].trim());
      }
    }
    for (const key in req.query) {
      if (Object.hasOwnProperty.call(req.query, key)) {
        if (typeof req.body[key] == "string")
          req.query[key] = xss(req.query[key].trim());
      }
    }
    for (const key in req.params) {
      if (Object.hasOwnProperty.call(req.params, key)) {
        if (typeof req.body[key] == "string")
          req.params[key] = xss(req.params[key].trim());
      }
    }
    next();
  });
};
