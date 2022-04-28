const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.users;
const postCollection = mongoCollections.posts;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const MyError = require("../helper/message").MyError;
const { ObjectId } = require("mongodb");
const common = require("../helper/common");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const userDataFunc = require("../data/user");
const postDataFunc = require("../data/post");
// const channelData = require("./channel");

async function addUser(
  name,
  email,
  password,
  profilePicture,
  userName,
  bio,
  courses,
  gender,
  contactNo,
  dob,
  friends
) {
  password = await bcrypt.hash(password, common.saltRounds);
  const userCol = await userCollection();
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
    friends: friends,
    privacy: [],
  };
  const insertInfo = await userCol.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user";
  const newId = insertInfo.insertedId;
  const curruser = await userDataFunc.getUser(newId.toString());
  return curruser;
}

async function addPost(user, text, image, likes, comments, category) {
  const newPost = {
    user: {
      userId: user._id,
      userName: user.userName,
      profilePicture: user.profilePicture,
    },
    text: text,
    image: image,
    likes: likes,
    comments: comments,
    dateCreated: new Date(new Date().toUTCString()),
    category: category.toString(),
  };
  const postCol = await postCollection();
  const insertInfo = await postCol.insertOne(newPost);

  if (insertInfo.length === 0)
    throw new MyError(errorCode.INTERNAL_SERVER_ERROR, "Could not add a post");
  let id = insertInfo.insertedId;
  const post = await postDataFunc.getById(id.toString());
  return post;
}

module.exports = {
  addUser,
  addPost,
};
