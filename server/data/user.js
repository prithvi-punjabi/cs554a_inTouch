const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.users;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const MyError = require("../helper/message").MyError;
const { ObjectId } = require("mongodb");
const common = require("../helper/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const channelData = require("./channel");
var jwt = require("jsonwebtoken");
const mapper = require("../helper/mappers");
const { users } = require("../config/mongoCollections");

const checkLoggedInUser = async (token) => {
  let decoded = jwt.verify(token, process.env.SECRET);
  const loggedInUser = await getUser(decoded.user_id);
  return loggedInUser;
};

const fetchUser = async (accessKey) => {
  validator.checkNonNull(accessKey);
  validator.checkString(accessKey);
  const { data } = await axios.get(
    "https://sit.instructure.com/api/v1/users/self/profile",
    {
      headers: {
        Authorization: `Bearer ${accessKey}`,
      },
    }
  );
  const thisUser = {};
  thisUser.name = data.name;
  thisUser.profilePicture = data.avatar_url;
  thisUser.email = data.primary_email;
  thisUser.bio = data.bio ? data.bio : "No bio set in canvas";
  thisUser.calendar = data.calendar.ics;
  return thisUser;
};

const fetchCourses = async (accessKey) => {
  validator.checkNonNull(accessKey);
  validator.checkString(accessKey);
  const { data } = await axios.get(
    "https://sit.instructure.com/api/v1/courses?enrollment_type=student",
    {
      headers: {
        Authorization: `Bearer ${accessKey}`,
      },
    }
  );
  let courses = [];
  let today = new Date();
  const allChannels = await channelData.getAll();

  for (let i = 0; i <= data.length - 1; i++) {
    let x = data[i];
    let temp = {};
    temp.id = x.id;
    temp.name = x.course_code;
    temp.code = x.name;
    temp.end_date = x.end_at;
    if (temp.code.substring(0, 4) === "2022") {
      let channelNotFound = true;
      for (let j = 0; j <= allChannels.length - 1; j++) {
        if (x.name == allChannels[j].name) {
          channelNotFound = false;
        }
      }
      if (channelNotFound) {
        let newChannelData = await channelData.create(
          x.name,
          x.course_code,
          "No Description"
        );
      }
      courses.push(temp);
    }

    temp = {};
  }

  return courses;
};

const create = async (
  accessKey,
  password,
  userName,
  gender,
  contactNo,
  dob
) => {
  validator.checkPassword(password);
  validator.checkString(userName, "Username");
  validator.checkGender(gender, "Gender");
  validator.checkPhoneNumber(contactNo, "Phone number");
  validator.checkDob(dob, "Date of Birth");

  const canvasUser = await fetchUser(accessKey);
  const userCourses = await fetchCourses(accessKey);
  const userCol = await userCollection();
  const existingUser = await userCol.findOne({ userName: userName });
  if (existingUser != null) {
    const error = new Error(
      `The username you have supplid is not available! Please pick another one.`
    );
    error.code = common.errorCode.BAD_REQUEST;
    throw error;
  }
  const existingUser2 = await userCol.findOne({ email: canvasUser.email });
  if (existingUser2 !== null) {
    const error = new Error(
      `A student has already registed an account on inTouch with the same Canvas authorization. If you feel like this is a mistake, please contact the Stevens IT Help Desk, as someone else may have access to your Canvas Access Token.`
    );
    error.code = common.errorCode.BAD_REQUEST;
    throw error;
  }

  password = await bcrypt.hash(password, common.saltRounds);

  const newUser = {
    name: canvasUser.name,
    email: canvasUser.email,
    password: password,
    profilePicture: canvasUser.profilePicture,
    userName: userName,
    bio: canvasUser.bio,
    courses: userCourses,
    designation: common.designation.USER,
    gender: gender,
    contactNo: contactNo,
    dob: dob,
    friends: [],
    privacy: [],
  };
  const insertInfo = await userCol.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";
  const newId = insertInfo.insertedId;
  const curruser = await getUser(newId.toString());
  await mapper.channelFromUser(newId);
  return curruser;
};

const getUser = async (userId) => {
  validator.checkNonNull(userId);
  validator.checkString(userId);
  validator.checkObjectID(userId);
  userId = utils.parseObjectId(userId);

  const userCol = await userCollection();
  const user = await userCol.findOne({ _id: userId });
  if (user) {
    user._id = user._id.toString();
    return user;
  } else {
    const error = new Error("User does not exist");
    error.code = common.errorCode.NOT_FOUND;
    throw error;
  }
};

const getFriends = async (userId) => {
  validator.checkNonNull(userId);
  validator.checkString(userId);
  validator.checkObjectID(userId);
  userId = utils.parseObjectId(userId);
  const userCol = await userCollection();
  const user = await userCol.findOne({ _id: userId });
  if (user) {
    return user.friends;
  } else {
    const error = new Error("User does not exist");
    error.code = common.errorCode.NOT_FOUND;
    throw error;
  }
};

const getByName = async (username) => {
  validator.checkString(username, "username");
  const userCol = await userCollection();
  const users = await userCol
    .find({
      name: { $regex: `.*${username}.*`, $options: "i" },
    })
    .toArray();
  if (users && Array.isArray(users) && users.length != 0) {
    return users;
  } else {
    const error = new Error("No users found with name " + username);
    error.code = common.errorCode.NOT_FOUND;
    throw error;
  }
};

const getFriendRecommendations = async (user) => {
  validator.checkNonNull(user._id);
  validator.checkString(user._id);
  validator.checkObjectID(user._id);
  user._id = utils.parseObjectId(user._id);
  user.friends = user.friends.map((userId) =>
    utils.parseObjectId(userId, "friends.userId")
  );

  const userCol = await userCollection();
  if (user) {
    const myCourses = user.courses.map((course) => course.id);
    const recommendations = await userCol
      .find({
        _id: { $nin: user.friends.concat([user._id]) },
        "courses.id": { $in: myCourses },
      })
      .limit(4)
      .toArray();
    return recommendations;
  } else {
    throw "No recommendations found";
  }
};

const loginUser = async (email, password) => {

  validator.checkNonNull(email);
  validator.checkNonNull(password);

  validator.checkString(email);
  validator.checkString(password);

  const usercol = await userCollection();
  const user = await usercol.findOne({ email: email.toLowerCase() });

  if (user == null) {
    const error = new Error("Either username or password is invalid");
    error.code = common.errorCode.FORBIDDEN;
    throw error;
  }

  let isAuthenticated = false;
  try {
    isAuthenticated = await bcrypt.compare(password, user.password);
  } catch (e) {
    throw new Error(e.message);
  }

  if (!isAuthenticated) {
    const error = new Error("Either username or password is invalid");
    error.code = common.errorCode.FORBIDDEN;
    throw error;
  } else {
    return user;
  }
};

const addFriend = async (userId, friendId) => {
  validator.checkNonNull(friendId);
  validator.checkNonNull(userId);
  validator.checkObjectID(friendId);
  validator.checkObjectID(userId);
  userId = utils.parseObjectId(userId);
  const userCol = await userCollection();

  let friendExists = await userCol.findOne({
    _id: userId,
    friends: friendId,
  });
  if (!friendExists) {
    const addedFriend = await userCol.updateOne(
      { _id: userId },
      { $push: { friends: friendId } }
    );

    if (addedFriend.modifiedCount == 0) {
      const error = new Error("Could not add friend");
      error.code = common.errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }

  friendExists = await userCol.findOne({
    _id: ObjectId(friendId),
    friends: userId,
  });
  if (!friendExists) {
    const addedFriend = await userCol.updateOne(
      { _id: ObjectId(friendId) },
      { $push: { friends: userId.toString() } }
    );

    if (addedFriend.modifiedCount == 0) {
      const error = new Error("Could not add friend");
      error.code = common.errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }
  let thisFriend = await getUser(friendId);
  return thisFriend;
};

const delFriend = async (userId, friendId) => {
  validator.checkNonNull(friendId);
  validator.checkNonNull(userId);
  validator.checkObjectID(friendId);
  validator.checkObjectID(userId);
  userId = utils.parseObjectId(userId);
  const userCol = await userCollection();

  let friendExists = await userCol.findOne({
    _id: userId,
    friends: friendId,
  });
  if (friendExists) {
    const deletedFriend = await userCol.updateOne(
      { _id: userId },
      { $pull: { friends: friendId } }
    );
    if (deletedFriend.modifiedCount == 0) {
      const error = new Error("Could not remove friend");
      error.code = common.errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }

  friendExists = await userCol.findOne({
    _id: ObjectId(friendId),
    friends: userId.toString(),
  });
  if (friendExists) {
    const deletedFriend = await userCol.updateOne(
      { _id: ObjectId(friendId) },
      { $pull: { friends: userId.toString() } }
    );
    if (deletedFriend.modifiedCount == 0) {
      const error = new Error("Could not remove friend");
      error.code = common.errorCode.INTERNAL_SERVER_ERROR;
      throw error;
    }
  }
  let thisFriend = await getUser(friendId);
  return thisFriend;
};

const changeReadStatus = async (userId, c_id, mCount) => {
  validator.checkNonNull(userId);
  validator.checkNonNull(c_id);
  validator.checkObjectID(userId);
  validator.checkObjectID(c_id);
  const userCol = await userCollection();
  const update = await userCol.updateOne(
    { _id: ObjectId(userId), "readStatus.c_id": c_id },
    { $set: { "readStatus.$.mCount": mCount } }
  );
  const updatedUser = await userCol.findOne({ _id: ObjectId(userId) });
  return updatedUser.readStatus;
};

module.exports = {
  checkLoggedInUser,
  create,
  getUser,
  getFriendRecommendations,
  loginUser,
  addFriend,
  delFriend,
  changeReadStatus,
  getFriends,
  getByName,
};
