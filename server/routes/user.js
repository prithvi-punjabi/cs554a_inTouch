const express = require("express");
const router = express.Router();
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const { ErrorMessage, MyError, SuccessMessage } = require("../helper/message");
const userData = require("../data").userData;
const { ObjectId } = require("mongodb");
const { errorCode } = require("../helper/common");
const { delFriend } = require("../data/user");

router.get("/:userId", async (req, res) => {
  try {
    validator.checkNonNull(req.params.userId);
    validator.checkString(req.params.userId);
    validator.checkObjectID(req.params.userId, "User ID");
    let userId = req.params.userId;

    const thisUser = await userData.getUser(userId);

    return res.json(thisUser);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/create", async (req, res) => {
  try {
    let accessKey = req.body.accessKey;
    validator.checkNonNull(accessKey);
    validator.checkString(accessKey);

    // ALL VALUES HAVE TO BE TAKEN FROM THE USER
    let password = "Password123!";
    let username = "User name";
    let pronouns = "He/him";
    let gender = 0;
    let contactNum = "000-000-0000";
    let dob = "09/08/1997";

    const courses = await userData.fetchCourses(accessKey);
    const thisUser = await userData.fetchUser(accessKey);

    const addedUser = await userData.create(
      thisUser.name,
      thisUser.email,
      password,
      thisUser.profilePicture,
      username,
      thisUser.bio,
      pronouns,
      courses,
      gender,
      contactNum,
      dob
    );

    return res.json(addedUser);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/addFriend/:friendId", async (req, res) => {
  try {
    validator.checkNonNull(friendId);
    validator.checkString(friendId);
    validator.checkObjectID(friendId, "Friend ID");
    let friendId = req.params.friendId;

    // User ID will be populated from session of logged in user
    let userId = "abcd";

    const addFriend = await userData.addFriend(userId, friendId);

    return res.json(addFriend);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/delFriend/:friendId", async (req, res) => {
  try {
    validator.checkNonNull(friendId);
    validator.checkString(friendId);
    validator.checkObjectID(friendId, "Friend ID");
    let friendId = req.params.friendId;

    // User ID will be populated from session of logged in user
    let userId = "abcd";

    const addFriend = await userData.delFriend(userId, friendId);

    return res.json(delFriend);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

module.exports = router;