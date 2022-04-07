const xss = require("xss");

module.exports = async (app) => {
  app.use((req, res, next) => {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    if (!req.query.currency) req.query.currency = "INR";
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
