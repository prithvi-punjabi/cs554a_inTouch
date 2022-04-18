const { gql } = require("apollo-server-express");
const channelData = require("./data").channelData;

const typeDefs = gql``;

const channelResolvers = {};

module.exports = {
  typeDefs,
  channelResolvers,
};
