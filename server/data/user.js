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
    "https://sit.instructure.com/api/v1/courses?enrollment_type=student&enrollment_state=active",
    {
      headers: {
        Authorization: `Bearer ${accessKey}`,
      },
    }
  );
  let courses = [];
  let today = new Date();
  data.forEach((x) => {
    let temp = {};
    temp.id = x.id;
    temp.name = x.course_code;
    temp.code = x.name;
    temp.end_date = x.end_at;
    courses.push(temp);
    temp = {};
  });
  return courses;
};

const create = async (
  name,
  email,
  password,
  profilePicture,
  userName,
  bio,
  courses,
  gender,
  contactNo,
  dob
) => {
  validator.checkString(name, "Name");
  validator.checkEmail(email);
  validator.checkPassword(password);
  validator.checkString(profilePicture, "Profile Picture");
  validator.checkString(userName, "Username");
  validator.checkString(bio, "Bio");
  // validator.checkStringArray(courses, "Courses");
  validator.checkGender(gender, "Gender");
  validator.checkPhoneNumber(contactNo, "Phone number");
  validator.checkDob(dob, "Date of Birth");

  const userCol = await userCollection();
  const existingUser = await userCol.findOne({ userName: userName });
  if (existingUser != null) {
    throw `Username not available!`;
  }

  password = await bcrypt.hash(password, common.saltRounds);

  const newUser = {
    name: name,
    email: email,
    password: password,
    profilePicture: profilePicture,
    userName: userName,
    bio: bio,
    courses: courses,
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

  const friendExists = await userCol.findOne({
    _id: userId,
    friends: [friendId],
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
    let thisFriend = await getUser(friendId);

    return `${thisFriend.name} was added to your friend list.`;
  } else throw "Friend already exists";
};

const delFriend = async (userId, friendId) => {
  validator.checkNonNull(friendId);
  validator.checkNonNull(userId);
  validator.checkObjectID(friendId);
  validator.checkObjectID(userId);
  userId = utils.parseObjectId(userId);
  const userCol = await userCollection();

  let thisFriend = await getUser(friendId);
  const friendExists = await userCol.findOne({
    _id: userId,
    friends: [friendId],
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

    return `${thisFriend.name} was removed from your friend list`;
  } else throw "Friend does not exist";
};

module.exports = {
  fetchUser,
  fetchCourses,
  create,
  getUser,
  loginUser,
  addFriend,
  delFriend,
};
