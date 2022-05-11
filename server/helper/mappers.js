// const fs = require("fs");
// const channelMapsFile = "../maps/channelMaps.json";
const channelDataFunctions = require("../data/channel");
const mongoCollections = require("../config/mongoCollections");
const userCollection = mongoCollections.users;
const channelMapCollection = mongoCollections.channelMap;
const { ObjectId } = require("mongodb");
module.exports = {
  async usersForChannel(channelId) {
    const channelMapCol = await channelMapCollection();
    const channelMap = await channelMapCol.findOne({ name: "CHANNEL_MAP" });
    return channelMap[String(channelId)];
  },
  async channelMapCheck(userId, channelId) {
    const channelMapCol = await channelMapCollection();
    const channelMap = await channelMapCol.findOne({ name: "CHANNEL_MAP" });
    //made a change after right comment//Turns out String thing worked while it shouldnt,probably requires change
    if (channelMap[channelId].indexOf(userId) === -1) {
      return false;
    } else {
      return true;
    }
  },
  async channelAndUser(userId, channelId, cName) {
    const channelMapCol = await channelMapCollection();
    const channelMap = await channelMapCol.findOne({ name: "CHANNEL_MAP" });
    //   console.log(channelMap);
    //   let map = { name: "CHANNEL_MAP" };
    if (channelMap == null) {
      await channelMapCol.insertOne({ name: "CHANNEL_MAP" });
    }
    //   else {
    //     map = channelMap[0];
    //   }
    //   if (!map[channelId]) {
    //     map[channelId] = [];
    //   }
    const updated = await channelMapCol.updateOne(
      { name: "CHANNEL_MAP" },
      { $addToSet: { [String(channelId)]: String(userId) } }
    );
    let readStatusObj = {};
    readStatusObj["c_id"] = String(channelId);
    readStatusObj["cName"] = cName;
    readStatusObj["mCount"] = 0;
    const userCol = await userCollection();
    const final = userCol.updateOne(
      { _id: ObjectId(userId) },
      { $addToSet: { readStatus: readStatusObj } }
    );
    //   if (updated.modifiedCount == 1) {
    //     console.log("modified");
    //   }
  },
  async channelFromUser(userId) {
    const channelsForUser = await channelDataFunctions.getByUser(
      String(userId)
    );
    for (let j = 0; j <= channelsForUser.length - 1; j++) {
      await this.channelAndUser(
        userId,
        channelsForUser[j]._id,
        channelsForUser[j].name
      );
    }
  },
};

const channelToUser = async (userId, channelId) => {
  const channelMapCol = await channelMapCollection();
  const channelMap = await channelMapCol.findOne({ name: "CHANNEL_MAP" });
  //   console.log(channelMap);
  //   let map = { name: "CHANNEL_MAP" };
  if (channelMap == null) {
    await channelMapCol.insertOne({ name: "CHANNEL_MAP" });
  }
  //   else {
  //     map = channelMap[0];
  //   }
  //   if (!map[channelId]) {
  //     map[channelId] = [];
  //   }
  const updated = await channelMapCol.updateOne(
    { name: "CHANNEL_MAP" },
    { $addToSet: { [String(channelId)]: String(userId) } }
  );
  let readStatusObj = {};
  readStatusObj["c_id"] = String(channelId);
  readStatusObj["cName"] = cName;
  readStatusObj["mCount"] = 0;
  const userCol = await userCollection();
  const final = userCol.updateOne(
    { _id: ObjectId(userId) },
    { $addToSet: { readStatus: readStatusObj } }
  );
  //   if (updated.modifiedCount == 1) {
  //     console.log("modified");
  //   }
};

const sample = async () => {
  const allUsersCol = await userCollection();
  const allUsers = await allUsersCol.find({}).toArray();
  for (let i = 0; i <= allUsers.length - 1; i++) {
    const channelsForUser = await channelDataFunctions.getByUser(
      String(allUsers[i]._id)
    );
    for (let j = 0; j <= channelsForUser.length - 1; j++) {
      await channelToUser(
        allUsers[i]._id,
        channelsForUser[j]._id,
        channelsForUser[j].name
      );
    }
  }

  //   allUsers.forEach(async (user) => {
  //     const channelsForUser = await channelData.getByUser(String(user._id));
  //     channelsForUser.forEach(async (channel) => {
  //       await channelToUser(user._id, channel._id);
  //     });
  //   });
  return;
};

// sample();
// channelToUser("10", "20");
