const mongoCollections = require("../config/mongoCollections");
const channelCollection = mongoCollections.channels;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const MyError = require("../helper/message").MyError;
const { ObjectId } = require("mongodb");
const common = require("../helper/common");
// const userData = require("./user");
const userCollection = mongoCollections.users;

const getById = async (id) => {
  validator.checkNonNull(id);
  validator.checkString(id, "ChannelId");

  id = utils.parseObjectId(id);
  const channelCol = await channelCollection();
  let channel = await channelCol.findOne({ _id: id });
  if (channel == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No channel found with id - ${id.toString()}`
    );
  }
  return channel;
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

const getByUser = async (id) => {
  validator.checkNonNull(id);
  validator.checkString(id, "UserId");
  const userDoc = await getUser(id);
  const channelCol = await channelCollection();
  let channel = await channelCol
    .find({
      name: {
        $in: userDoc.courses.map((e) => {
          return e.code;
        }),
      },
    })
    .toArray();
  return channel;
};

const getAll = async () => {
  const channelCol = await channelCollection();
  const channels = await channelCol.find({}).toArray();
  // if (!Array.isArray(channels) || channels.length == 0) {
  //   throw new MyError(errorCode.NOT_FOUND, `No channels found`);
  // }
  return channels;
};

const create = async (name, displayName, description) => {
  validator.checkString(name, "name");
  validator.checkString(displayName, "displayName");
  validator.checkString(description, "description");

  const newChannel = {
    name: name,
    displayName: displayName,
    description: description,
    dateCreated: new Date(new Date().toUTCString()),
    status: common.channelStatus.OPEN,
    messages: [],
  };

  const channelCol = await channelCollection();
  const insertInfo = await channelCol.insertOne(newChannel);

  if (insertInfo.length === 0)
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      "Could not create channel"
    );
  let id = insertInfo.insertedId;
  const channel = await getById(id.toString());
  return channel;
};

const update = async (channelId, displayName, description) => {
  channelId = validator.checkObjectID(channelId, "channelId");
  validator.checkString(displayName, "displayName");
  validator.checkString(description, "description");

  const updatedChannel = {
    displayName: displayName,
    description: description,
  };

  const originalChannel = await getById(channelId.toString()); //needed to make sure that channel exists

  const channelCol = await channelCollection();
  const updateInfo = await channelCol.updateOne(
    { _id: channelId },
    { $set: updatedChannel }
  );

  if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0)
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      "Could not update channel info"
    );
  const channel = await getById(channelId.toString());
  return channel;
};

const remove = async (channelId) => {
  channelId = validator.checkObjectID(channelId, "channelId");
  const channelCol = await channelCollection();
  const oldChannel = await getById(channelId.toString());
  if (oldChannel == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No channel found with id - ${channelId.toString()}`
    );
  }

  const deleteInfo = await channelCol.deleteOne({ _id: channelId });
  if (deleteInfo.deletedCount == 0) {
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      `Could not delete channel - ${channelId.toString()}`
    );
  }
  return oldChannel;
};

const addMessage = async (channelId, user, message) => {
  channelId = validator.checkObjectID(channelId, "channelId");
  validator.checkUser(user);
  validator.checkString(message);

  const channelCol = await channelCollection();
  let channel = await getById(channelId.toString()); //needed to make sure that channel exists

  const msgId = ObjectId();
  const newMsgObj = {
    _id: msgId,
    user: {
      userId: user._id,
      userName: user.userName,
      profilePicture: user.profilePicture,
    },
    message: message,
    dateCreated: new Date(new Date().toUTCString()),
  };

  const updateInfo = await channelCol.updateOne(
    { _id: channelId },
    { $push: { messages: newMsgObj } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(errorCode.NOT_FOUND, `Could not add message to channel`);
  }
  return newMsgObj;
};

const deleteMessage = async (msgId, userId) => {
  msgId = validator.checkObjectID(msgId, "messageId");
  userId = validator.checkObjectID(userId, "userId");

  const channelCol = await channelCollection();
  let oldChannel = await channelCol.findOne(
    { "messages._id": msgId },
    { projection: { _id: 1, "messages.$": 1 } }
  );
  if (oldChannel == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No channel found with message - ${msgId.toString()}`
    );
  }

  if (oldChannel.messages[0].user.userId.toString() != userId.toString()) {
    throw new MyError(
      errorCode.UNAUTHORIZED,
      `Cannot delete someone else's message`
    );
  }

  const updateInfo = await channelCol.updateOne(
    { "messages._id": msgId },
    { $pull: { messages: oldChannel.messages[0] } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      `Could not delete message from channel`
    );
  }
  return oldChannel.messages[0];
};

const getChannelsForUser = async (user) => {
  validator.checkUser(user);
  const courses = [];
  for (let i = 0; i < user.courses.length; i++) {
    const courseName = user.courses[i].code;
    courses.push(courseName);
  }

  const channelCol = await channelCollection();
  let channels = await channelCol.find({ name: { $in: courses } }).toArray();
  if (channels == null || !Array.isArray(channels) || channels.length == 0) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No channel found within ${courses}`
    );
  }
  return channels;
};

module.exports = {
  create,
  getById,
  getAll,
  update,
  remove,
  addMessage,
  deleteMessage,
  getChannelsForUser,
  getByUser,
};
