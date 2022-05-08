const { gql } = require("apollo-server-express");
const channelData = require("../data").channelData;
const { GraphQLDateTime } = require("graphql-scalars");
const mapper = require("../helper/mappers");
const userData = require("../data").userData;
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
  type test {
    msg: String
  }
  type Subscription {
    channels(userId: ID): channel
  }
  type Query {
    getChannelById(id: ID): channel
    getAllChannels: [channel]
    getChannelsForUser(userId: ID): [channel]
    getUsersForChannel(id: ID): [user]
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
    addMessage(channelId: ID, message: String): message
    deleteMessage(messageId: ID, userId: ID): message
    testMessage(msg: String): test
  }
`;
//REOMVED FROM ADD MESSAGE : , user: channelUserInp
// type test {
//   //   msg: String
//   // }
// type Subscription {
//   messages: [test]
// }

///WHY IS IT CONST?
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();
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
    getUsersForChannel: async (_, args) => {
      const userStrings = await mapper.usersForChannel(args.id);
      let users = [];
      for (x of userStrings) {
        let thisUser = await userData.getUser(x);
        users.push(thisUser);
      }
      return users;
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
      // console.log(context);
      const user = {
        _id: context.user._id,
        userName: context.user.userName,
        profilePicture: context.user.profilePicture,
      };
      // const user = {
      //   _id: "625a4cc4368c53d53cf0cdb1",
      //   userName: "BigBoss",
      //   profilePicture: "invalid url",
      // };
      console.log(args);
      const addedMessage = await channelData.addMessage(
        args.channelId,
        user,
        args.message
      );
      const updatedChannels = await channelData.getByUser(context.user._id);
      // console.log(
      //   updatedChannels[0].messages[updatedChannels[0].messages.length - 1]
      // );
      ///////////////////////////////////
      // console.log("before:");
      // console.log(pubsub);
      const channelUsers = await mapper.usersForChannel(args.channelId);
      for (let i = 0; i <= channelUsers.length - 1; i++) {
        const updatedChannel = await channelData.getById(args.channelId);
        // console.log(updatedChannel);
        pubsub.publish([String(channelUsers[i])], {
          channels: updatedChannel,
        });
      }
      // console.log("after:");
      // console.log(pubsub);
      //////////////////////////////////
      // for (let i = 0; i<= channelUsers.) {
      // console.log(doSend);
      // if (doSend) {
      //   console.log("yay");
      //   console.log(pubsub);
      //   pubsub.publish([String(eventUserId)], {
      //     channels: updatedChannels,
      //   });
      // }
      // }

      // console.log("nay");
      // console.log(pubsub);
      // subscribers.forEach((fn) => fn());
      return updatedChannels;
    },
    deleteMessage: async (_, args, context) => {
      const deletedMesssage = await channelData.deleteMessage(
        args.messageId,
        context.user._id
      );
      return deletedMesssage;
    },
    testMessage: async (_, args, context) => {
      // console.log(pubsub);
      pubsub.publish("MESSAGE", { messages: [args] });
      return args;
      // subscribers.forEach((fn) => fn());
    },
  },
  Subscription: {
    channels: {
      subscribe: (_, args) => {
        // console.log(args);
        return pubsub.asyncIterator([args.userId]);
      },
    },
    // messages: {
    //   subscibe: async (parent, args) => {
    //     let channel = 1;
    //     // const messages = await channelData.getById(channel);
    //     console.log(pubsub);
    //     onMessagesUpdates(() =>
    //       pubsub.publish(["NUMBER_INCREMENTED"], {
    //         messages: [{ msg: args.msg }],
    //       })
    //     );
    //     setTimeout(
    //       () =>
    //         pubsub.publish(["NUMBER_INCREMENTED"], {
    //           messages: [{ msg: args.msg }],
    //         }),
    //       0
    //     );
    //     return pubsub.asyncIterator(["NUMBER_INCREMENTED"]);
    //     // return pubsub.asyncIterator("subscribed");
    //   },
    // },
  },
};

module.exports = {
  typeDefs,
  channelResolvers,
};
