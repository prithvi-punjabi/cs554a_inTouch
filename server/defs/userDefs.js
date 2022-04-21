const { gql } = require("apollo-server-express");
const userData = require("../data").userData;
var jwt = require("jsonwebtoken");
require("dotenv").config();
const LocalStorage = require("node-localstorage").LocalStorage;
localStorage = new LocalStorage("./scratch");

const typeDefs = gql`
  type course {
    id: Int
    name: String
    code: String
    end_date: String
  }
  type user {
    _id: String
    name: String
    email: String
    password: String
    profilePicture: String
    userName: String
    bio: String
    designation: Int
    gender: String
    contactNo: String
    dob: String
    courses: [course]
    privacy: [String]
    friends: [String]
  }
  type Query {
    getUser(userId: ID!): user
    loginUser(email: String!, password: String!): String
  }
  type Mutation {
    createUser(
      accessKey: String!
      password: String!
      userName: String!
      gender: String!
      contactNo: String!
      dob: String!
    ): user
    addFriend(userId: ID!, friendId: ID!): String
    deleteFriend(userId: ID!, friendId: ID!): String
  }
`;

const userResolvers = {
  Query: {
    getUser: async (_, args, context) => {
      const user = await userData.getUser(args.userId);
      return user;
    },
    loginUser: async (_, args, context) => {
      const loggedInUser = await userData.loginUser(args.email, args.password);
      const token = jwt.sign(
        {
          user_id: loggedInUser._id.toString(),
          email: loggedInUser.email,
        },
        process.env.SECRET,
        {
          expiresIn: "2h",
        }
      );
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      return token;
    },
  },
  Mutation: {
    createUser: async (_, args) => {
      const createdUser = await userData.create(
        args.accessKey,
        args.password,
        args.userName,
        args.gender,
        args.contactNo,
        args.dob
      );
      return createdUser;
    },
    addFriend: async (_, args) => {
      const addFriend = await userData.addFriend(args.userId, args.friendId);
      return addFriend;
    },
    deleteFriend: async (_, args) => {
      const delFriend = await userData.delFriend(args.userId, args.friendId);
      return delFriend;
    },
  },
};

module.exports = {
  typeDefs,
  userResolvers,
};
