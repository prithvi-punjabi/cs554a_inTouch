const postRoutes = require("./post");
const userRoutes = require("./user");
const channelRoutes = require("./channel");
module.exports = async (app) => {
  app.use("/posts", postRoutes);
  app.use("/user", userRoutes);
  app.use("/channels", channelRoutes);
  app.use("/*", (req, res) => {
    console.log(req.baseUrl, req.method);
    return res.status(404).json({
      error: "Page not found",
    });
  });
};
