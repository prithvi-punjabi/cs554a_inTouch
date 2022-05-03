const { gql } = require("apollo-server-express");
const userData = require("../data").userData;
var jwt = require("jsonwebtoken");

const typeDefs = gql`
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
    loginUser(email: String!, password: String!): userLogin
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
  }
`;

const userResolvers = {
  Query: {
    getUser: async (_, args) => {
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
  },
};

module.exports = {
  typeDefs,
  userResolvers,
};
