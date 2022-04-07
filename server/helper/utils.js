const { errorCode, designation } = require("./common");
const { ObjectId } = require("mongodb");
const moment = require("moment");
const MyError = require("./message").MyError;
var nodemailer = require("nodemailer");
const { google } = require("googleapis");
const validator = require("./validator");
const common = require("./common");

const oAuthClient = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

module.exports = {
  parseObjectId(id, varName) {
    if (varName == null) varName = "Id";
    if (typeof id === "string" && ObjectId.isValid(id)) {
      return ObjectId(id.trim());
    }
    throw new MyError(errorCode.BAD_REQUEST, `Invalid ${varName} - ${id}`);
  },
  isNullOrEmpty(val) {
    if (typeof val == "string") return val == null || val.trim() == "";
    else if (Array.isArray(val)) {
      for (let i = 0; i < val.length; i++) {
        if (!this.isNullOrEmpty(val[i])) return false;
      }
      return true;
    } else if (typeof val == "object") return this.isEmptyObject(val);
    else return val == null;
  },
  isEmptyObject(obj) {
    return obj == null || Object.keys(obj).length == 0;
  },
  formatDaysAgo(date, locale) {
    if (typeof date != "date") date = new Date(date);
    let delta = (date.getTime() - Date.now()) / (1000 * 3600 * 24);
    const formatter = new Intl.RelativeTimeFormat(locale);
    delta = Math.round(delta);
    if (delta == 0) {
      return "Today";
    } else if (delta <= -365) {
      delta /= 365;
      delta = Math.round(delta);
      return formatter.format(delta, "years");
    } else {
      return formatter.format(delta, "days");
    }
  },
  isUserLoggedIn(req) {
    return req.session.user != null;
  },
  isAdmin(req) {
    return (
      req.session.user != null &&
      (req.session.user.designation == designation.ADMIN ||
        req.session.user.designation == designation.SUPER_ADMIN)
    );
  },
  isSuperAdmin(req) {
    return (
      req.session.user != null &&
      req.session.user.designation == designation.SUPER_ADMIN
    );
  },
  getDateObject(date) {
    return moment(date, "MM/DD/YYYY").toDate();
  },
  renderLoginWithError(req, res, error) {
    return res.status(errorCode.FORBIDDEN).render("login", {
      title: "Login",
      error: error,
      baseUrl: req.originalUrl,
      user: req.session.user,
      currency: req.query.currency,
      currencySymbol: common.currency[req.query.currency],
      categories: common.categories,
    });
  },
  renderError(req, res, e) {
    if (typeof e == "string") e = new MyError(errorCode.BAD_REQUEST, e);
    e.code = validator.isValidResponseStatusCode(e.code) ? e.code : 500;
    return res.status(e.code).render("error", {
      code: e.code,
      error: e.message,
      user: req.session.user,
      currency: req.query.currency,
      currencySymbol: common.currency[req.query.currency],
      categories: common.categories,
    });
  },
  renderComingsoon(req, res) {
    return res.render("comingSoon", {
      title: "Coming Soon",
      user: req.session.user,
      currency: req.query.currency,
      currencySymbol: common.currency[req.query.currency],
      categories: common.categories,
    });
  },
  async sendEmail(email, subject, body) {
    let accessToken = await oAuthClient.getAccessToken();
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: subject,
      text: body,
      html: body,
      auth: {
        user: process.env.EMAIL,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
        expires: 1484314697598,
      },
    };
    let info = await transporter.sendMail(mailOptions);
    return info;
  },
};
