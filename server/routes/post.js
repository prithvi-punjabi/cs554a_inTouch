const express = require("express");
const router = express.Router();
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const { ErrorMessage, MyError, SuccessMessage } = require("../helper/message");
const postData = require("../data").postData;
const { ObjectId } = require("mongodb");
const { errorCode } = require("../helper/common");

let user = {
  _id: ObjectId(),
  userName: "Nevil",
  profilePicture: "https://www.w3schools.com/howto/img_avatar.png",
};

router.get("/", async (req, res) => {
  try {
    let posts;
    if (utils.isEmptyObject(req.query)) {
      posts = await postData.getAll(1);
    } else {
      if (req.query.category != null) {
        req.query.category = JSON.parse(decodeURIComponent(req.query.category));
      }
      posts = await postData.getByQuery(req.query);
    }
    return res.json(posts);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.get("/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    validator.checkObjectID(postId, "postId");
    const post = await postData.getById(postId);
    res.json(post);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/add", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const { text, image, category } = req.body;

    // user = req.session.user;

    validator.checkUser(user);
    validator.checkString(text, "text");
    validator.checkString(image, "image");
    validator.checkCategory(category, "category");

    const post = await postData.create(user, text, image, category);
    return res.json(post);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.put("/update/:postId", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const { text, image, category } = req.body;
    const postId = req.params.postId;

    // user = req.session.user;

    validator.checkUser(user);
    validator.checkObjectID(postId, "postId");
    validator.checkString(text, "text");
    validator.checkString(image, "image");
    validator.checkCategory(category, "category");

    const post = await postData.update(postId, user, text, category);
    return res.json(post);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.delete("/delete/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;
    validator.checkObjectID(postId, "postId");
    const deletedPost = await postData.remove(postId, user);
    res.json(deletedPost);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/comments/add", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const { postId, comment } = req.body;
    validator.checkString(postId, "postId");
    validator.checkString(comment, "comment");

    // user = req.session.user;

    const commentObj = await postData.addComment(postId, user, comment);
    return res.json(commentObj);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.delete("/comments/delete/:commentId", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const commentId = req.params.commentId;
    validator.checkString(commentId, "commentId");

    // user = req.session.user;

    const commentObj = await postData.deleteComment(
      commentId,
      user._id.toString()
    );
    return res.json(commentObj);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/like/:postId", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const postId = req.params.postId;
    validator.checkObjectID(postId, "postId");

    // user = req.session.user;

    const response = await postData.likeAPost(postId, user._id.toString());
    return res.json(response);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

router.post("/unlike/:postId", async (req, res) => {
  try {
    if (req.body == null)
      return res.status(400).json(ErrorMessage("Missing body parameters"));
    const postId = req.params.postId;
    validator.checkObjectID(postId, "postId");

    // user = req.session.user;

    const response = await postData.unlikeAPost(postId, user._id.toString());
    return res.json(response);
  } catch (e) {
    if (typeof e == "string") {
      e = new MyError(errorCode.BAD_REQUEST, e);
    }
    return res
      .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
      .json(ErrorMessage(e.message));
  }
});

module.exports = router;
