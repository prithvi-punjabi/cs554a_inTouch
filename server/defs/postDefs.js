const { gql } = require("apollo-server-express");
const postData = require("../data").postData;
const { GraphQLDateTime } = require("graphql-scalars");

const typeDefs = gql`
  scalar DateTime
  type postUser {
    _id: ID
    name: String
    userName: String
    profilePicture: String
  }

  input postUserInp {
    _id: ID
    name: String
    userName: String
    profilePicture: String
  }

  input queryInp {
    search: String
    user_id: String
    category: String
    page: String
    sort_by: String
  }

  input courseInp {
    id: Int
    name: String
    code: String
    end_date: String
  }

  input fullUser {
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
    courses: [courseInp]
    privacy: [String]
    friends: [String]
  }

  type Comments {
    _id: String
    comment: String
    dateCreated: String
    user: postUser
  }

  type Post {
    _id: ID
    text: String
    image: String
    dateCreated: DateTime
    category: String
    comments: [Comments]
    likes: [String]
    user: postUser
  }

  type Query {
    getPost(postId: String): Post
    getAll(pageNumber: Int): [Post]
    getByQuery(queryFields: queryInp): [Post]
    getPostsForUser(pageNumber: Int): [Post]
  }

  type Mutation {
    createPost(text: String, image: String, category: String): Post
    updatePost(postId: ID, text: String, category: String): Post
    removePost(postId: ID): Post
    addComment(postId: ID, comment: String): Post
    deleteComment(commentId: ID): Post
    likePost(postId: ID): Post
    unlikePost(postId: ID): String
  }
`;

const postResolvers = {
  Query: {
    getPost: async (_, args) => {
      const post = await postData.getById(args.postId);
      return post;
    },
    getAll: async (_, args) => {
      const allPosts = await postData.getAll(args.pageNumber);
      return allPosts;
    },
    getByQuery: async (_, args, context) => {
      const user = context.user;
      const queryAllPosts = await postData.getByQuery(user, args.queryFields);
      return queryAllPosts;
    },
    getPostsForUser: async (_, args, context) => {
      const allUserPosts = await postData.getPostsForUser(
        context.user,
        args.pageNum
      );
      return allUserPosts;
    },
  },
  Mutation: {
    createPost: async (_, args, context) => {
      const user = {
        _id: context.user._id,
        name: context.user.name,
        userName: context.user.userName,
        profilePicture: context.user.profilePicture,
      };
      const createdPost = await postData.create(
        user,
        args.text,
        args.image,
        args.category
      );
      return createdPost;
    },
    updatePost: async (_, args, context) => {
      const user = {
        _id: context.user._id,
        name: context.user.name,
        userName: context.user.userName,
        profilePicture: context.user.profilePicture,
      };
      const updatedPost = await postData.update(
        args.postId,
        user,
        args.text,
        args.category
      );
      return updatedPost;
    },
    removePost: async (_, args, context) => {
      const user = {
        _id: context.user._id,
        name: context.user.name,
        userName: context.user._userName,
        profilePicture: context.user.profilePicture,
      };
      const removedPost = await postData.remove(args.postId, user);
      return removedPost;
    },
    addComment: async (_, args, context) => {
      const user = {
        _id: context.user._id,
        name: context.user.name,
        userName: context.user.userName,
        profilePicture: context.user.profilePicture,
      };
      const addedComment = await postData.addComment(
        args.postId,
        user,
        args.comment
      );
      return addedComment;
    },
    deleteComment: async (_, args, context) => {
      const delCom = await postData.deleteComment(
        args.commentId,
        context.user._id
      );
      return delCom;
    },
    likePost: async (_, args, context) => {
      const likePost = await postData.likeAPost(args.postId, context.user._id);
      return likePost;
    },
    unlikePost: async (_, args, context) => {
      const unlikePost = await postData.unlikeAPost(
        args.postId,
        context.user._id
      );
      return unlikePost;
    },
  },
};

module.exports = {
  typeDefs,
  postResolvers,
};
