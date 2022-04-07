const postRoutes = require("./post");
const userRoutes = require("./user");
module.exports = async (app) => {
  app.use("/posts", postRoutes);
  app.use("/user", userRoutes);
  app.use("/*", (req, res) => {
    console.log(req.baseUrl, req.method);
    return res.status(404).json({
      error: "Page not found",
    });
  });
};
