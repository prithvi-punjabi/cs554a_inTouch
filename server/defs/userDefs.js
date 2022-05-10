const { gql } = require("apollo-server-express");
const userData = require("../data").userData;
var jwt = require("jsonwebtoken");

const typeDefs = gql`
  scalar DateTime
  type course {
    id: Int
    name: String
    code: String
    end_date: String
  }
  type userLogin {
    token: String
    userId: String
  }
  type readStatusType {
    c_id: String!
    mCount: Int
    cName: String
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
    readStatus: [readStatusType]
  }
  type Query {
    getUser(userId: ID!): user
    loginUser(email: String!, password: String!): userLogin
    getFriendRecommendations: [user]
    getFriends: [user]
    getByName(username: String!): [user]
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
    addFriend(friendId: ID!): user
    deleteFriend(friendId: ID!): user
    readChange(c_id: String!, mCount: Int!): [readStatusType]
  }
`;

const userResolvers = {
  Query: {
    getUser: async (_, args) => {
      const user = await userData.getUser(args.userId);
      return user;
    },
    getFriends: async (_, args, context) => {
      const friendsArr = await userData.getFriends(context.user._id);
      let friends = [];
      for (x of friendsArr) {
        let thisUser = await userData.getUser(x);
        friends.push(thisUser);
      }
      return friends;
    },
    getByName: async (_, args, context) => {
      const users = await userData.getByName(args.username);
      return users;
    },
    getFriendRecommendations: async (_, args, context) => {
      const recommendations = await userData.getFriendRecommendations(
        context.user
      );
      return recommendations;
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
      return { token: token, userId: loggedInUser._id };
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
    addFriend: async (_, args, context) => {
      const userId = context.user._id;
      const addFriend = await userData.addFriend(userId, args.friendId);
      return addFriend;
    },
    deleteFriend: async (_, args, context) => {
      const userId = context.user._id;
      const delFriend = await userData.delFriend(userId, args.friendId);
      return delFriend;
    },
    readChange: async (_, args, context) => {
      // console.log(args);
      // console.log(context);
      const userId = context.user._id;
      const changed = await userData.changeReadStatus(
        userId,
        args.c_id,
        args.mCount
      );
      return changed;
    },
  },
};

module.exports = {
  typeDefs,
  userResolvers,
};
