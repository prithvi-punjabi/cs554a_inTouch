const moment = require("moment");
const { ObjectId } = require("mongodb");
const common = require("./common");

module.exports = {
  checkNonNull() {
    for (let i = 0; i < arguments.length; i++) {
      const val = arguments[i];
      if (val == null) throw `A field is either null or not passed`; //used == to also consider undefined values
    }
  },

  checkNumber(num, varName) {
    if (varName == null) varName = "Parameter";
    if (num == null) throw `Must pass ${varName}`;
    num = parseFloat(num);
    if (isNaN(num)) throw `${varName} must be a number`;
  },

  checkString(str, varName) {
    if (!varName) varName = "Parameter";
    if (str == null) throw `Must pass ${varName}`;
    if (typeof str !== "string") throw `${varName} must be a string`;
    if (str.trim().length == 0)
      throw `${varName} must not be just empty spaces`;
  },

  checkStringArray(arr, varName) {
    if (!varName) varName = "Parameter";
    if (arr == null) throw `Must pass ${varName}`;
    if (!Array.isArray(arr)) throw `${varName} must be an array`;
    arr.forEach((val) => {
      if (typeof val != "string" || val.trim().length == 0)
        throw `${varName} must contain non-empty strings`;
    });
  },

  checkObjectID(id, varName) {
    if (!varName) varName = "id";
    if (!ObjectId.isValid(id)) {
      throw `Invalid ${varName}: ${id}`;
    }
    return ObjectId(id);
  },

  checkUser(user) {
    if (user == null) throw `Must pass user object`;
    if (!this.isValidObject(user)) throw `User must be an object`;
    const { _id, userName } = user;
    if (typeof _id != typeof ObjectId())
      throw "user._id must be of type ObjectId";
    this.checkString(userName, "username");
  },

  checkGender(genderCode) {
    if (genderCode == null) throw `Must pass gender`;
    genderCode = Number(genderCode);
    if (isNaN(genderCode)) throw `${varName} must be a number`;
    let isValid = false;
    for (const key in common.gender) {
      if (Object.hasOwnProperty.call(common.gender, key)) {
        if (common.gender[key] == genderCode) isValid = true;
      }
    }
    if (!isValid)
      throw `Gender must be within [${Object.values(common.gender)}]`;
  },

  checkChannalStatus(status) {
    status = Number(status);
    if (isNaN(status)) throw `Channel status must be a number`;
    let isValid = false;
    for (const key in common.channelStatus) {
      if (Object.hasOwnProperty.call(common.channelStatus, key)) {
        if (common.channelStatus[key] == status) isValid = true;
      }
    }
    if (!isValid)
      throw `Channel status must be within [${Object.values(
        common.channelStatus
      )}]`;
  },

  checkCategory(category) {
    this.checkString(category);
    for (let i = 0; i < common.category.length; i++) {
      const c = common.category[i];
      if (c.toLowerCase() == category.toLowerCase()) {
        return;
      }
    }
    throw `Category must be within [${common.category}]`;
  },

  checkPassword(str) {
    this.checkString(str, "Password");
    const regEx =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
    if (!str.match(regEx))
      throw `Password must contain at least one upper, one lower, one special character and one number`;
  },

  checkEmail(email) {
    if (email == null) throw `Must pass email address`;
    let regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/g;
    if (!email.match(regex)) throw `Invalid email address`;
  },

  checkDate(date, varName) {
    if (varName == null) varName = "Date";
    if (!moment(date, "MM/DD/YYYY").isValid())
      throw `Invalid ${varName} (Required format: MM/DD/YYYY)`;
  },

  checkDesignation(designation) {
    if (designation == null) throw `Must pass designation`;
    if (common.designation[designation.toLowerCase()] == null)
      throw `Invalid designation`;
  },

  isValidObject(obj) {
    return typeof obj == "object" && !Array.isArray(obj);
  },

  checkDob: (input) => {
    let today = new Date().toLocaleDateString();
    let currmonth = parseInt(today.split("/")[0]);
    let currday = parseInt(today.split("/")[1]);
    let curryear = parseInt(today.split("/")[2]);
    let month = parseInt(input.split("-")[1]);
    let day = parseInt(input.split("-")[2]);
    let year = parseInt(input.split("-")[0]);
    if (currmonth === month && currday === day && curryear === year)
      throw "Your birthday cannot be today";
    if (curryear - year < 13) {
      throw "You need to be older than 13 to access re$ale";
    }
    // Check if day in date supplied is out of range of month
    if (
      month === 1 ||
      month === 3 ||
      month === 5 ||
      month === 7 ||
      month === 8 ||
      month === 10 ||
      month === 12
    ) {
      if (day < 0 || day > 31) throw `${day} does not exist in ${month}`;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
      if (day < 0 || day > 30) throw `${day} does not exist in ${month}`;
    }
    if (month === 2) {
      if (day < 0 || day > 28) throw `${day} does not exist in ${month}`;
    }
    // Check if inputted date is in the future
    if (
      (day > currday && month == currmonth && year == curryear) ||
      (day > currday && month > currmonth && year > curryear) ||
      (month > currmonth && year > curryear) ||
      (month > currmonth && year == curryear) ||
      year > curryear
    ) {
      throw "Your birthday cannot be in the future";
    }
  },

  isEmptyObject(obj) {
    if (this.isValidObject(obj)) {
      return Object.keys(obj).length == 0;
    }
    return true;
  },

  isValidResponseStatusCode(code) {
    if (code == null || isNaN(code)) return false;
    code = Number(code);
    return code >= 100 && code < 600;
  },

  isValidObjectID(id) {
    return ObjectId.isValid(id);
  },
};
