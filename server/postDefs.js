const { gql } = require("apollo-server-express");
const postData = require("./data").postData;

const typeDefs = gql`
  type postUser {
    _id: ID
    userName: String
    profilePicture: String
  }

  input postUserInp {
    _id: ID
    userName: String
    profilePicture: String
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
    dateCreated: String
    category: String
    comments: [Comments]
    likes: [String]
    user: postUser
  }

  type Query {
    getPost(postId: String): Post
    getAll(pageNumber: Int): [Post]
  }

  type Mutation {
    createPost(
      user: postUserInp
      text: String
      image: String
      category: String
    ): Post
    updatePost(
      postId: ID
      user: postUserInp
      text: String
      category: String
    ): Post
    removePost(postId: ID, user: postUserInp): Post
    addComment(postId: ID, user: postUserInp, comment: String): Comments
    deleteComment(commentId: ID, userId: ID): Comments
    likePost(postId: ID, userId: ID): String
    unlikePost(postId: ID, userId: ID): String
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
  },
  Mutation: {
    createPost: async (_, args) => {
      const createdPost = await postData.create(
        args.user,
        args.text,
        args.image,
        args.category
      );
      return createdPost;
    },
    updatePost: async (_, args) => {
      const updatedPost = await postData.update(
        args.postId,
        args.user,
        args.text,
        args.category
      );
      return updatedPost;
    },
    removePost: async (_, args) => {
      const removedPost = await postData.remove(args.postId, args.user);
      return removedPost;
    },
    addComment: async (_, args) => {
      const addedComment = await postData.addComment(
        args.postId,
        args.user,
        args.comment
      );
      return addedComment;
    },
    deleteComment: async (_, args) => {
      const delCom = await postData.deleteComment(args.commentId, args.userId);
      return delCom;
    },
    likePost: async (_, args) => {
      const likePost = await postData.likeAPost(args.postId, args.userId);
      return likePost;
    },
    unlikePost: async (_, args) => {
      const unlikePost = await postData.unlikeAPost(args.postId, args.userId);
      return unlikePost;
    },
  },
};

module.exports = {
  typeDefs,
  postResolvers,
};
