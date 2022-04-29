const { gql } = require("apollo-server-express");
const channelData = require("./data").channelData;
const { GraphQLDateTime } = require("graphql-scalars");

const typeDefs = gql`
  scalar DateTime
  input channelCourse {
    id: Int
    name: String
    code: String
    end_date: String
  }
  input fullUserInp {
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
    courses: [channelCourse]
    privacy: [String]
    friends: [String]
  }
  input channelUserInp {
    _id: ID
    userName: String
    profilePicture: String
  }
  type channelUser {
    userId: ID
    userName: String
    profilePicture: String
  }
  type message {
    _id: ID
    user: channelUser
    message: String
    dateCreated: DateTime
  }
  type channel {
    _id: ID
    name: String
    displayName: String
    description: String
    dateCreated: DateTime
    status: Int
    messages: [message]
  }
  type Query {
    getChannelById(id: ID): channel
    getAllChannels: [channel]
    getChannelsForUser(userId: ID): [channel]
  }
  type Mutation {
    createChannel(
      name: String
      displayName: String
      description: String
    ): channel
    updateChannel(
      channelId: ID
      displayName: String
      description: String
    ): channel
    removeChannel(channelId: ID): channel
    addMessage(channelId: ID, user: channelUserInp, message: String): message
    deleteMessage(messageId: ID, userId: ID): message
  }
`;

const channelResolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    getChannelById: async (_, args) => {
      const thisChannel = await channelData.getById(args.id);
      return thisChannel;
    },
    getAllChannels: async (_, args) => {
      const allChannels = await channelData.getAll();
      return allChannels;
    },
    getChannelsForUser: async (_, args, context) => {
      const userChannels = await channelData.getByUser(args.userId);
      return userChannels;
    },
  },
  Mutation: {
    createChannel: async (_, args) => {
      const thisChannel = await channelData.create(
        args.name,
        args.displayName,
        args.description
      );
      return thisChannel;
    },
    updateChannel: async (_, args) => {
      const updatedChannel = await channelData.update(
        args.channelId,
        args.displayName,
        args.description
      );
      return updatedChannel;
    },
    removeChannel: async (_, args) => {
      const removedChannel = await channelData.remove(args.channelId);
      return removedChannel;
    },
    addMessage: async (_, args, context) => {
      const user = {
        _id: context.user._id,
        userName: context.user._userName,
        profilePicture: context.user.profilePicture,
      };
      const addedMessage = await channelData.addMessage(
        args.channelId,
        user,
        args.message
      );
      return addedMessage;
    },
    deleteMessage: async (_, args, context) => {
      const deletedMesssage = await channelData.deleteMessage(
        args.messageId,
        context.user._id
      );
      return deletedMesssage;
    },
  },
};

module.exports = {
  typeDefs,
  channelResolvers,
};
