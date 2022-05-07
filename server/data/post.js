const mongoCollections = require("../config/mongoCollections");
const postCollection = mongoCollections.posts;
const validator = require("../helper/validator");
const utils = require("../helper/utils");
const errorCode = require("../helper/common").errorCode;
const MyError = require("../helper/message").MyError;
const { ObjectId } = require("mongodb");
const common = require("../helper/common");

const getById = async (id) => {
  validator.checkNonNull(id);
  validator.checkString(id);

  id = utils.parseObjectId(id);
  const postCol = await postCollection();
  let post = await postCol.findOne({ _id: id });
  if (post == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No post found with id - ${id.toString()}`
    );
  }
  post = manipulatePost(post);
  return post;
};

const getPostsForUser = async (user, pageNumber) => {
  user._id = utils.parseObjectId(user._id, "user._id");
  validator.checkUser(user);
  const postCol = await postCollection();
  let posts;
  posts = await postCol
    .find({
      "user._id": { $in: user.friends.concat([user._id.toString()]) },
    })
    .skip(pageNumber > 0 ? (pageNumber - 1) * common.PER_PAGE_POST : 0)
    .limit(common.PER_PAGE_POST)
    .sort({ _id: -1 })
    .toArray();
  if (!Array.isArray(posts) || posts.length == 0) {
    throw new MyError(errorCode.NOT_FOUND, `No posts found`);
  }
  posts = await manipulatePosts(posts);
  return posts;
};

const getByQuery = async (user, query) => {
  validator.checkNonNull(query);
  validator.checkUser(user);
  let { search, userId, category, page, sort_by } = query;

  const main_query = [{ "user._id": { $in: user.friends.concat([user._id]) } }];

  //#region master search
  const search_query = [];
  if (typeof search == "string") {
    search_query.push({ text: { $regex: `.*${search}.*`, $options: "i" } });
    search_query.push({
      "user.name": { $regex: `.*${search}.*`, $options: "i" },
    });
  }
  if (search_query.length != 0) {
    main_query.push({ $or: search_query });
  }
  //#endregion

  //#region category
  if (typeof category == "string") {
    main_query.push({ category: { $regex: `.*${category}.*`, $options: "i" } });
  } else if (Array.isArray(category)) {
    var categoryRegEx = [];
    for (let i = 0; i < category.length; i++) {
      const c = category[i];
      categoryRegEx.push(new RegExp(c, "i"));
    }
    main_query.push({ category: { $in: categoryRegEx } });
  }
  //#endregion

  const sortBy = {
    dateCreated: -1,
  };

  let posts;
  const postCol = await postCollection();
  if (main_query.length == 0 && validator.isEmptyObject(sortBy)) {
    posts = await postCol
      .find({})
      .skip(page > 0 ? (page - 1) * common.PER_PAGE_POST : 0)
      .limit(common.PER_PAGE_POST)
      .toArray();
  } else if (main_query.length == 0 && !validator.isEmptyObject(sortBy)) {
    posts = await postCol
      .find({})
      .sort(sortBy)
      .skip(page > 0 ? (page - 1) * common.PER_PAGE_POST : 0)
      .limit(common.PER_PAGE_POST)
      .toArray();
  } else if (main_query.length != 0 && validator.isEmptyObject(sortBy)) {
    posts = await postCol
      .find({
        $and: main_query,
      })
      .skip(page > 0 ? (page - 1) * common.PER_PAGE_POST : 0)
      .limit(common.PER_PAGE_POST)
      .toArray();
  } else {
    posts = await postCol
      .find({
        $and: main_query,
      })
      .skip(page > 0 ? (page - 1) * common.PER_PAGE_POST : 0)
      .limit(common.PER_PAGE_POST)
      .sort(sortBy)
      .toArray();
  }
  if (!Array.isArray(posts) || posts.length == 0) {
    throw new MyError(errorCode.NOT_FOUND, `No post found`);
  }
  posts = await manipulatePosts(posts);
  return posts;
};

const getAll = async (pageNumber) => {
  const postCol = await postCollection();
  let posts;
  posts = await postCol
    .find({})
    .skip(pageNumber > 0 ? (pageNumber - 1) * common.PER_PAGE_POST : 0)
    .limit(common.PER_PAGE_POST)
    .sort({ _id: -1 })
    .toArray();
  if (!Array.isArray(posts) || posts.length == 0) {
    throw new MyError(errorCode.NOT_FOUND, `No posts found`);
  }
  posts = await manipulatePosts(posts);
  return posts;
};

const create = async (user, text, image, category) => {
  validator.checkUser(user);
  validator.checkString(text, "text");
  validator.checkCategory(category, "category");

  const newPost = {
    user: {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      profilePicture: user.profilePicture,
    },
    text: text,
    image: image,
    likes: [],
    comments: [],
    dateCreated: new Date(new Date().toUTCString()),
    category: category.toString(),
  };

  const postCol = await postCollection();
  const insertInfo = await postCol.insertOne(newPost);

  if (insertInfo.length === 0)
    throw new MyError(errorCode.INTERNAL_SERVER_ERROR, "Could not add a post");
  let id = insertInfo.insertedId;
  const post = await getById(id.toString());
  return post;
};

const update = async (postId, user, text, category) => {
  postId = validator.checkObjectID(postId, "postId");
  validator.checkUser(user);
  validator.checkString(text, "text");
  validator.checkCategory(category, "category");

  const updatedPost = {
    text: text,
    category: category,
  };

  const originalPost = await getById(postId.toString());
  if (originalPost.user._id.toString() != user._id.toString()) {
    throw new MyError(
      errorCode.UNAUTHORIZED,
      "You cannot update someone else's post"
    );
  }

  const postCol = await postCollection();
  const updateInfo = await postCol.updateOne(
    { _id: postId },
    { $set: { text: text, category: category } }
  );

  if (updateInfo.matchedCount == 0 || updateInfo.modifiedCount == 0)
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      "your post could not be updated. This may be because you have not updated any fields. Edit a field, and try again."
    );
  const post = await getById(postId.toString());
  return post;
};

const remove = async (postId, user) => {
  postId = validator.checkObjectID(postId);
  const postCol = await postCollection();
  const oldPost = await getById(postId.toString());
  if (oldPost == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No post found with id - ${postId.toString()}`
    );
  }
  if (
    oldPost.user._id.toString() != user._id.toString() &&
    user.designation != common.designation.ADMIN &&
    user.designation != common.designation.SUPER_ADMIN
  ) {
    throw new MyError(
      errorCode.UNAUTHORIZED,
      `Cannot delete someone else's post`
    );
  }
  const deleteInfo = await postCol.deleteOne({ _id: postId });
  if (deleteInfo.deletedCount == 0) {
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      `Could not delete post with id: ${postId.toString()}`
    );
  }
  return oldPost;
};

const addComment = async (postId, user, comment) => {
  postId = validator.checkObjectID(postId, "postId");
  validator.checkUser(user);
  validator.checkString(comment);

  const postCol = await postCollection();
  let post = await getById(postId.toString());

  const commentId = ObjectId();
  const newCommentObj = {
    _id: commentId,
    user: {
      _id: user._id,
      name: user.name,
      userName: user.userName,
      profilePicture: user.profilePicture,
    },
    comment: comment,
    dateCreated: new Date(new Date().toUTCString()),
  };

  const updateInfo = await postCol.updateOne(
    { _id: postId },
    { $push: { comments: newCommentObj } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(errorCode.NOT_FOUND, `Could not add comment to post`);
  }
  return await getById(postId.toString());
};

const deleteComment = async (commentId, userId) => {
  commentId = validator.checkObjectID(commentId, "commentId");
  userId = validator.checkObjectID(userId, "userId");

  const posts = await postCollection();
  let oldPost = await posts.findOne(
    { "comments._id": commentId },
    { projection: { _id: 1, "comments.$": 1 } }
  );
  if (oldPost == null) {
    throw new MyError(
      errorCode.NOT_FOUND,
      `No post found with comment - ${commentId.toString()}`
    );
  }

  if (oldPost.comments[0].user._id.toString() != userId.toString()) {
    throw new MyError(
      errorCode.UNAUTHORIZED,
      `Cannot delete someone else's comment`
    );
  }

  const updateInfo = await posts.updateOne(
    { "comments._id": commentId },
    { $pull: { comments: oldPost.comments[0] } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(
      errorCode.INTERNAL_SERVER_ERROR,
      `Could not delete comment from post`
    );
  }
  return await getById(oldPost._id.toString());
};

const likeAPost = async (postId, userId) => {
  postId = validator.checkObjectID(postId, "postId");
  validator.checkObjectID(userId, "userId");
  validator.checkString(userId, "userId");
  const post = await getById(postId.toString());
  const postCol = await postCollection();
  if (post.likes.includes(userId)) {
    const updateInfo = await postCol.updateOne(
      { _id: postId },
      { $pull: { likes: userId } }
    );
    if (updateInfo.modifiedCount == 0) {
      throw new MyError(errorCode.NOT_FOUND, `Could not unlike the post`);
    }
    return await getById(postId.toString());
  }
  const updateInfo = await postCol.updateOne(
    { _id: postId },
    { $push: { likes: userId } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(errorCode.NOT_FOUND, `Could not like the post`);
  }
  return await getById(postId.toString());
};

const unlikeAPost = async (postId, userId) => {
  postId = validator.checkObjectID(postId, "postId");
  validator.checkObjectID(userId, "userId");
  validator.checkString(userId, "userId");
  const post = await getById(postId.toString());
  if (!post.likes.includes(userId)) {
    throw new MyError(errorCode.NOT_FOUND, `You didn't like the post`);
  }
  const postCol = await postCollection();
  const updateInfo = await postCol.updateOne(
    { _id: postId },
    { $pull: { likes: userId } }
  );
  if (updateInfo.modifiedCount == 0) {
    throw new MyError(errorCode.NOT_FOUND, `Could not unlike the post`);
  }
  return `You unliked the post!`;
};

async function manipulatePost(post) {
  return post;
}

async function manipulatePosts(posts) {
  for (let i = 0; i < posts.length; i++) {
    posts[i] = await manipulatePost(posts[i]);
  }
  return posts;
}

module.exports = {
  create,
  getById,
  getByQuery,
  getPostsForUser,
  getAll,
  update,
  remove,
  manipulatePost,
  manipulatePosts,
  addComment,
  deleteComment,
  likeAPost,
  unlikeAPost,
};
