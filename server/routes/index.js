module.exports = async (app) => {
  app.use("/*", (req, res) => {
    console.log(req.baseUrl, req.method);
    return res.status(404).json({
      error: "Page not found",
    });
  });
};
