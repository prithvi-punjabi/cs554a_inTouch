const postRoutes = require("./post");
module.exports = async (app) => {
  app.use("/posts", postRoutes);
  app.use("/*", (req, res) => {
    console.log(req.baseUrl, req.method);
    return res.status(404).json({
      error: "Page not found",
    });
  });
};
