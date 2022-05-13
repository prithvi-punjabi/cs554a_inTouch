const express = require("express");
const router = express.Router();
const utils = require("../helper/utils");
const validator = require("../helper/validator");
const { ErrorMessage, MyError, SuccessMessage } = require("../helper/message");
const channelData = require("../data").channelData;
const { ObjectId } = require("mongodb");
const { errorCode } = require("../helper/common");
const common = require("../helper/common");

router.get("/", async (req, res) => {
	try {
		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to fetch channels"));
		}
		let channels = await channelData.getChannelsForUser(req.session.user);
		return res.json(channels);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.get("/all", async (req, res) => {
	try {
		if (!utils.isAdmin(req)) {
			return res
				.status(errorCode.UNAUTHORIZED)
				.json(ErrorMessage("You need admin access to fetch all channels"));
		}
		let channels = await channelData.getAll();
		return res.json(channels);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.get("/byUser/:userId", async (req, res) => {
	// try {
	const userId = req.params.userId;
	validator.checkObjectID(userId, "userId");
	// console.log(userId);
	const channels = await channelData.getByUser(userId);
	res.json(channels);
	// } catch (e) {
	//   if (typeof e == "string") {
	//     e = new MyError(errorCode.BAD_REQUEST, e);
	//   }
	//   console.log(e)
	//   return res
	//     .status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
	//     .json(ErrorMessage(e.message));
	// }
});

router.get("/:channelId", async (req, res) => {
	try {
		const channelId = req.params.channelId;
		validator.checkObjectID(channelId, "channelId");
		const channel = await channelData.getById(channelId);
		res.json(channel);
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
		const { name, displayName, description } = req.body;

		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to add channel"));
		}
		let user = req.session.user;

		if (
			user.designation != common.designation.ADMIN &&
			user.designation != common.designation.SUPER_ADMIN
		) {
			throw new MyError(
				errorCode.UNAUTHORIZED,
				"Only admin can create new channels"
			);
		}
		validator.checkString(name, "name");
		validator.checkString(displayName, "displayName");
		validator.checkString(description, "description");

		const channel = await channelData.create(name, displayName, description);
		return res.json(channel);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.put("/update/:channelId", async (req, res) => {
	try {
		if (req.body == null)
			return res
				.status(errorCode.BAD_REQUEST)
				.json(ErrorMessage("Missing body parameters"));
		const { displayName, description } = req.body;
		const channelId = req.params.channelId;

		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to update channel"));
		}
		let user = req.session.user;

		validator.checkUser(user);
		validator.checkObjectID(channelId, "channelId");
		validator.checkString(displayName, "displayName");
		validator.checkString(description, "description");

		const channel = await channelData.update(
			channelId,
			displayName,
			description
		);
		return res.json(channel);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.delete("/delete/:channelId", async (req, res) => {
	try {
		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to delete channel"));
		}
		if (user.designation != common.designation.SUPER_ADMIN) {
			throw new MyError(
				errorCode.UNAUTHORIZED,
				"Only super admin can delete channels"
			);
		}
		const channelId = req.params.channelId;
		validator.checkObjectID(channelId, "channelId");
		const deletedChannel = await channelData.remove(channelId);
		res.json(deletedChannel);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.post("/messages/add", async (req, res) => {
	try {
		if (req.body == null)
			return res
				.status(errorCode.BAD_REQUEST)
				.json(ErrorMessage("Missing body parameters"));
		const { channelId, message } = req.body;
		validator.checkString(channelId, "channelId");
		validator.checkString(message, "comment");

		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to add message"));
		}
		let user = req.session.user;

		const msgObj = await channelData.addMessage(channelId, user, message);
		return res.json(msgObj);
	} catch (e) {
		if (typeof e == "string") {
			e = new MyError(errorCode.BAD_REQUEST, e);
		}
		return res
			.status(validator.isValidResponseStatusCode(e.code) ? e.code : 500)
			.json(ErrorMessage(e.message));
	}
});

router.delete("/messages/delete/:msgId", async (req, res) => {
	try {
		if (req.body == null)
			return res
				.status(errorCode.BAD_REQUEST)
				.json(ErrorMessage("Missing body parameters"));
		const msgId = req.params.msgId;
		validator.checkString(msgId, "msgId");

		if (!utils.isUserLoggedIn(req)) {
			return res
				.status(errorCode.FORBIDDEN)
				.json(ErrorMessage("Login to delete message"));
		}
		let user = req.session.user;

		const msgObj = await channelData.deleteMessage(msgId, user._id.toString());
		return res.json(msgObj);
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
